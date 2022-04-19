const CONTRACT_NAME = "LPStaking";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  // Upgradeable Proxy
  await deploy("LPStaking", {
    from: deployer,
    proxy: {
      owner: deployer,
      execute: {
        init: {
          methodName: "initialize",
          args: [
                '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
                '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
                '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
                '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
            ]
        },
      },
    },
    log: true,
  });
};

module.exports.tags = [CONTRACT_NAME];