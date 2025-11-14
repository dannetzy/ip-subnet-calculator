function getSubnetMask(subnet) {
  if (subnet < 0) {
    throw new Error("Subnet can't be negative.");
  }
  if (isNaN(subnet)) {
    throw new Error("Subnet can't be NaN (not a number).");
  }
  if (subnet > 32) {
    throw new Error("Subnet can't be more than 32.");
  }

  let maskNumbers = [0, 128, 192, 224, 240, 248, 252, 254, 255];

  if (subnet >= 24) {
    return [maskNumbers[8], maskNumbers[8], maskNumbers[8], maskNumbers[subnet-24]];
  } 
  if (subnet >= 16) {
    return [maskNumbers[8], maskNumbers[8], maskNumbers[subnet-16], maskNumbers[0]];
  } 
  if (subnet >= 8) {
    return [maskNumbers[8], maskNumbers[subnet-8], maskNumbers[0], maskNumbers[0]];
  }
  return [maskNumbers[subnet], maskNumbers[0], maskNumbers[0], maskNumbers[0]]
}

function getBinary(number) {
  return number.toString(2).padStart(8, "0");
}

function getNumberCount(binary, number) {
  return binary.toString().split(number).length - 1;
}

function getHostCount(subnetMask) {
  return 2**getNumberCount(subnetMask.join(""), 0);
}

function getIpNetworkAndBroadcast(ipCount, hostId) {
  hostId = Number(hostId);
  let ipNetwork = 0;
  let ipBroadcast = ipCount-1;

  while (ipNetwork < 256) {
    if (ipBroadcast > hostId && hostId > ipNetwork) {
      return [ipNetwork, ipBroadcast];
    }

    ipNetwork += ipCount;
    ipBroadcast = ipNetwork + ipCount - 1;
  }
}

const ipFull = "195.20.40.245/27";
const ip = ipFull.split("/")[0];
const ipArray = ip.split('.');
const subnet = Number(ipFull.split("/")[1]);
const subnetMask = getSubnetMask(subnet);
const subnetMaskBinary = subnetMask.map(getBinary);
const subnetBlock = 2**getNumberCount(subnetMaskBinary.at(-1), 1);
const subnetBlockIpCount = 256 / subnetBlock;
const hostCount = getHostCount(subnetMaskBinary);
const ipNetworkBroadcast = getIpNetworkAndBroadcast(subnetBlockIpCount, ipArray.at(-1));

console.log(`
ip + subnet: ${ipFull} 
ip: ${ip}
subnet: /${subnet}
subnet mask: ${subnetMask}
subnet mask biner: ${subnetMaskBinary}
jumlah host: ${hostCount}
jumlah host yg bisa dipake: ${hostCount - 2}
subnet block: ${subnetBlock}
jumlah ip subnet block: ${subnetBlockIpCount}
ip network: ${ipNetworkBroadcast[0]}
ip broadcast: ${ipNetworkBroadcast[1]}
`)