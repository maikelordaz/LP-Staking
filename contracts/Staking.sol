//SPDX-License-Identifier: MIT
/**
* @title Staking
* @notice a contract to stake and calculate the staking rewards.
*/
pragma solidity ^0.8.4;

// INTERFACES USED //
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingRewards {

// VARIABLES //

    IERC20 public rewardsToken; //reward given to the user
    IERC20 public stakingToken; //token that the user stakes, both ERC20
    uint public rewardRate = 100; // tokens minted per second
    uint public lastUpdateTime; // last time this contract was called
    uint public rewardPerTokenStored; // rewardRate / _totalSupply
    uint private _totalSupply; // Asociated to the _balances mapping

// MAPPINGS //

    mapping(address => uint) public userRewardPerTokenPaid;
    mapping(address => uint) public rewards; 
    mapping(address => uint) private _balances; //tokens staked per user

// MODIFIERS //
    /**
    * @notice we update the reward every time the user interact with the contract
    */
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }

// FUNCTIONS //

    constructor(address _stakingToken, address _rewardsToken) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
    }
    /**
    * @notice functions to calculate rewards and earnings
    */
    function rewardPerToken() 
    public
    view
    returns (uint) {
        if(_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored+(((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / 
            _totalSupply);
    }

    function earned(address account) 
    public
    view
    returns (uint) {
        return ((_balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) +
            rewards[account];
    }
    /**
    * @notice the next three functions are the ones the user use to interact
    * @dev the user can stake tokens, withdraw staked tokens and get the reward by his stakings
    */
    function stake(uint _amount)
    external 
    updateReward(msg.sender) {
        _totalSupply += _amount;
        _balances[msg.sender] = _amount;
        stakingToken.transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(uint _amount)
    external
    updateReward(msg.sender) {
        _totalSupply -= _amount;
        _balances[msg.sender] -= _amount;
        stakingToken.transfer(msg.sender, _amount);
    }

    function getReward()
    external
    updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        rewardsToken.transfer(msg.sender, reward);
    }







}
