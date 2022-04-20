const web3 = require('web3');
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { ethers, waffle, deployments, getNamedAccounts } = require("hardhat");

const provider = ethers.provider;

describe("LPStacking", () => {
    let LPStacking, RewardToken;
    let owner, Alice, Bob;

    beforeEach(async () => {
        await deployments.fixture(['LPStacking']);
        let {deployer, user1, user2} = await getNamedAccounts();
        owner = await ethers.getSigner(deployer);
        Alice = await ethers.getSigner(user1);
        Bob = await ethers.getSigner(user2);
        LPStacking = await ethers.getContract('LPStacking', owner);
        RewardToken = await ethers.getContract('RewardToken', owner);
    });
});
