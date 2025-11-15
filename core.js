export function getSubnetMask(subnet) {
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
    return [255, 255, 255, maskNumbers[subnet-24]];
  } 
  if (subnet >= 16) {
    return [255, 255, maskNumbers[subnet-16], 0];
  } 
  if (subnet >= 8) {
    return [255, maskNumbers[subnet-8], 0, 0];
  }
  return [maskNumbers[subnet], 0, 0, 0]
}

export function getBinary(number) {
  return number.toString(2).padStart(8, "0");
}

export function getNumberCount(binary, number) {
  return binary.split(number).length - 1;
}

export function getHostCount(subnetMaskBinary) {
  return 2**getNumberCount(subnetMaskBinary.join(""), 0);
}

export function getNetworkAndBroadcast(ipCount, hostId) {
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

export function getSubnetBlock(binary) {
  return 2**getNumberCount(binary, 1);
}