const btn = document.querySelector(".submit");
const inputIp = document.querySelector("#ip");
const inputSubnet = document.querySelector("#subnet");

const resultELement = document.querySelectorAll(".results span");

btn.addEventListener("click", () => {
  applyResult(...resultELement);
});

inputIp.addEventListener("keyup", ({key}) => {
  if (key === 'Enter') {
    btn.click();
  }
});

inputSubnet.addEventListener("keyup", ({key}) => {
  if (key === 'Enter') {
    btn.click();
  }
});

function getResult(ip, subnet) {
  const ipArray = ip.split('.');
  const ipSubnet = ip + '/' + subnet;
  const subnetMask = getSubnetMask(subnet);
  const subnetMaskBinary = subnetMask.map(getBinary);
  const usableHost = getHostCount(subnetMaskBinary) - 2;
  const hostId = ipArray.at(-1);
  const subnetBlock = getSubnetBlock(subnetMaskBinary.at(-1));
  const subnetBlockIpCount = 256 / subnetBlock;
  const networkBroadcast = getNetworkAndBroadcast(subnetBlockIpCount, hostId);
  const ipNetwork = [...ipArray.slice(0, -1), networkBroadcast[0]].join('.') + '/' + subnet;
  const ipBroadcast = [...ipArray.slice(0, -1), networkBroadcast[1]].join('.') + '/' + subnet;

  return [ipSubnet, subnetMask.join('.'), usableHost, ipNetwork, ipBroadcast];
}

function applyResult(...resultElement) {
  const ip = inputIp.value;
  const subnet = inputSubnet.value;

  if (Number(subnet) < 24 || Number(subnet) > 32) {
    alert("Hanya menerima subnet /24 - /32.");
    return;
  }

  const result = getResult(ip, subnet);

  for (const [i, element] of resultElement.entries()) {
    element.innerHTML = result[i];
  }
  inputIp.value = "";
  inputSubnet.value = "";
}