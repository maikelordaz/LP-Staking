const CONTRACT_NAME = "RewardToken";

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();

    // Upgradeable Proxy
    await deploy("RewardToken", {
        from: deployer,
        proxy: {
            owner: deployer,
            execute: {
                init: {
                    methodName: "initialize",
                    args: [
                        10e36,
                    ]
                },
            },
        },
        log: true,
    });
};

module.exports.tags = [CONTRACT_NAME];