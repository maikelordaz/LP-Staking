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

    function stakeLPWithoutPermit() public {

    }
    
    function stakeLPWithPermit() public {

    }

    function addLiquidityAndStake() public {
        swapAddLiquidityAndStakeLP();
    }

    function stakeLiquidity() internal {
        
    }
}