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

function getBinary(number) {
  // converts number to base 2 (binary) and pad the start with 0's
  // the latter is not needed but it's there anyways
  return number.toString(2).padStart(8, "0");
}

function getNumberCount(binary, number) {
  const regex = new RegExp(number, 'g')
  return (binary.match(regex)||[]).length;
}

function getHostCount(subnetMaskBinary) {
  // host count = 2^(number of zeroes)
  return 2**getNumberCount(subnetMaskBinary.join(""), 0);
}

function getNetworkBroadcast(ipCount, hostId) {
  hostId = Number(hostId);
  let ipNetwork = 0;
  let ipBroadcast = ipCount-1;

  /* x = number of ip (ipCount)
    |  0  |  x   |  2x  |  3x  | ... |  ax  |
    |     |      |      |      |     |      |
    | x-1 | 2x-1 | 3x-1 | 4x-1 | ... |ax+x-1|
  */
  while (ipNetwork < 256) {
    if (ipBroadcast > hostId && hostId > ipNetwork) {
      return [ipNetwork, ipBroadcast];
    }

    ipNetwork += ipCount;
    ipBroadcast = ipNetwork + ipCount - 1;
  }
}

function getSubnetBlock(binary) {
  // host count = 2^(number of ones)
  return 2**getNumberCount(binary, 1);
}