//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// CONTRACTS INHERITHED
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./OptimalSwap.sol";
import "./StakingRewards.sol";

contract LPStaking is Initializable, OptimalSwap, StakingRewards  {

    /// Variables
    address router;
    address factory;
    address DAI;
    address ETH;


    /// Functions

    /**
     *  @notice Function initializer of this upgradeable contract
     *  @param _router is the address of the Uniswap Router V2
     *  @param _factory is the address of the Uniswap Factory V2
     *  @param _DAI is the address of the DAI Token
     *  @param _ETH is the address of the ETH Token
     *  @dev This address is the required by UniSwap for swaps between tokens and ETH
     *  @param _stakingToken is the address of the LP Token from Uniswap
     *  @param _rewardsToken is the address of our own Reward Token
     */
    function initialize(
        address _router,
        address _factory,
        address _DAI,
        address _ETH,
        address _stakingToken,
        address _rewardsToken
    ) public initializer {
        router = _router;
        factory = _factory;
        DAI = _DAI;
        ETH = _ETH;

        __OptimalSwap_init(
            router,
            factory,
            DAI,
            ETH
        );

        __Staking_init(_stakingToken, _rewardsToken);
    }

    /**
     *  @notice Function used to stake LP tokens already owned by the user
     *  @dev This function require the user to do an Approval transaction before
     *  @param _amount is a uint which is the amount of LP Tokens to be staked
     */
    function stakeLPWithoutPermit(uint _amount) public {
        require(stake(_amount));
    }
    
    /**
     *  @notice Function used to stake LP tokens already owned by the user
     *  @dev This function doesn't require the user to do an Approval transaction before
     *  @dev This function require a signature by the user in the off-chain
     *  @param _amount is a uint which is the amount of LP Tokens to be staked
     *  @param v is a uint8 that is part of the signature
     *  @param r is a bytes32 that is part of the signature
     *  @param s is a bytes32 that is part of the signature
     */
    function stakeLPWithPermit(uint _amount, uint8 v, bytes32 r, bytes32 s) public {
        require(stakeWithPermit(_amount, v, r, s));
    }

    /**
     *  @notice Function used to connect two contracts imported
     *  @dev This function allows the OptimalSwap to connect with StakingRewards
     */
    function stakeLiquidity(uint _amount) internal {
        require(stake(_amount));
    }
}