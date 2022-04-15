//SPDX-License-Identifier: MIT
/**
* @title Swap
* @notice a contract to calculate the optimal amount of tokens to swap, so when the user wants to add
* liquidity, contributing with only one token, it can be swapped by the optimal amount.
*/
pragma solidity ^0.8.4;

// INTERFACES USED //
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
// LIBRARIES USED //
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract OptimalSwap {

// VARIABLES //

    using SafeMath for uint;
    address private constant ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private constant DAI = 0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735;
    address private constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    IUniswapV2Router02 internal constant router = IUniswapV2Router02(ROUTER);
    IUniswapV2Factory internal constant factory = IUniswapV2Factory(FACTORY);
    IERC20 internal constant dai = IERC20(DAI);

// EVENTS //    

    event Log(string message, uint value);

// FUNCTIONS // 
    /**
    * @notice an auxiliar function to get the square root
    */
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
        // else z = 0
    }
    /**
    * @notice an auxiliar function to get the optimal swap amount to add liquidity
    * @dev according to the Uniswap´s whitepaper and it´s maths, regarding to the swaps and fees
    * the formula to calculate the swap before adding liquidity is
    * s = (sqrt(((2-f)r)^2+4(1-f)ar)-(2-f)r)/(2(1-f))
    * where
    * s = optimal swap amount
    * r = amount of reserve of token a
    * a = amount of token a the user has
    * f = swap fee percent
    * With the actual fee of 0.3% or 3/1000 we have that the final result is the one inside the 
    * function.
    * @param r amount of reserve of token a
    * @param a amount of token a the user has
    */
    function getAmount(uint r, uint a) public pure returns (uint) {
        return (sqrt(r.mul(r.mul(3988009)+a.mul(3988000))).sub(r.mul(1997)))/1994;
    }
    /**
    * @notice the main function to swap and addliquidity
    * @dev only adds liquidity to the ETH / DAI pool
    */
    function swapAndAddLiquidity() 
    external
    payable {
        require(msg.value > 0, "You have to send some ether.");
        // Get the ETH / DAI pair price
        address pair = factory.getPair(ETH, DAI);
        // Get the reserves of ETH
        (uint reserve0, , ) = IUniswapV2Pair(pair).getReserves();
        // Calculate the optimal amount to swap and the amount left.
        uint ethToSwap = getAmount(reserve0, msg.value);
        uint ethLeft = msg.value - ethToSwap;
        // Get the actual contract´s DAI´s balance
        uint afterDAIbalance = dai.balanceOf(address(this));
        // Perform the swap
        address[] memory path = new address[](2);
        path[0] = ETH;
        path[1] = DAI;
        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value:ethToSwap}(
            1, path, address(this), block.timestamp);
        // Get the new contract´s DAI´s balance and calculate the DAIs get from the swap
        uint beforeDAIbalance = dai.balanceOf(address(this));
        uint actualDAI = beforeDAIbalance - afterDAIbalance;
        // Approve the Uniswap Router to spend the corresponding balance
        dai.approve(ROUTER, actualDAI);
        // Add the liquidity with the ETH left and the corresponding DAI
        (uint amountDAI, uint amountETH, uint liquidity) = 
            router.addLiquidityETH{value:ethLeft}(DAI, actualDAI, 1, 1, address(this), block.timestamp); 
        // Emit the corresponding events
        emit Log("DAI amount", amountDAI);      
        emit Log("ETH amount", amountETH);   
        emit Log("liquidity", liquidity);    
    }
}
