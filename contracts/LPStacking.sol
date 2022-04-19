//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// CONTRACTS INHERITHED
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./OptimalSwap.sol";

contract LPStaking is Initializable, OptimalSwap  {

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
        address _ETH
    ) public initializer {
        router = _router; // 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
        factory = _factory; // 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
        DAI = _DAI; // 0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735;
        ETH = _ETH; // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

        __OptimalSwap_init(
            router,
            factory,
            DAI,
            ETH
        );
    }

    function addLiquidity() public payable {
        
    }
}