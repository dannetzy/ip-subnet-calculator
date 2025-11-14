const btn = document.querySelector(".submit");
const inputIp = document.querySelector("#ip");
const inputSubnet = document.querySelector("#subnet");

const resultIp = document.querySelector(".ip-subnet");
const resultSubnetMask = document.querySelector(".subnet-mask");
const resultUsableHost = document.querySelector(".usable-host");
const resultIpNetwork = document.querySelector(".ip-network");
const resultIpBroadcast = document.querySelector(".ip-broadcast");

btn.addEventListener("click", () => {
  applyResult(resultIp, resultSubnetMask, resultUsableHost, resultIpNetwork, resultIpBroadcast);
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

  const result = getResult(ip, subnet);

  for (const [i, element] of resultElement.entries()) {
    element.innerHTML = result[i]
  }
  inputIp.value = "";
  inputSubnet.value = "";
}