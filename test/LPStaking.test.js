const web3 = require('web3');
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { ethers, waffle, deployments, getNamedAccounts } = require("hardhat");

const provider = ethers.provider;

describe("LPStaking", () => {
    let LPStaking, RewardToken;
    let owner, Alice, Bob;

    beforeEach(async () => {
        await deployments.fixture(['LPStaking']);
        let {deployer, user1, user2} = await getNamedAccounts();
        owner = await ethers.getSigner(deployer);
        Alice = await ethers.getSigner(user1);
        Bob = await ethers.getSigner(user2);
        LPStaking = await ethers.getContract('LPStaking', owner);
        RewardToken = await ethers.getContract('RewardToken', owner);
    });

    describe("Deploy", () => {
        it("Should set the variable correct", async () => {
            expect(await LPStaking.isAdmin(owner.address)).to.be.equal(true);
            expect(await LPStaking.rewardRate()).to.be.equal(100);
            expect(await LPStaking.rewardPerTokenStored()).to.be.equal(0);
            expect(await LPStaking.totalSupply()).to.be.equal(0);
        });
    });

    describe("LPStaking functions", () => {
        it("Should work in the principal workflow", async() => {
            // Principal workflow consist in a user sending ETH to add liquidity to the ETH - DAI Uniswap pool, and stake the LP tokens received in the contract
            LPStaking.connect(Alice).swapAddLiquidityAndStakeLP({value: parseEther("1")});
        });
    });
});
