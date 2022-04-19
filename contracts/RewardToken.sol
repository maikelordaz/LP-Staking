/// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract RewardToken is ERC20Upgradeable, OwnableUpgradeable {
    /// VARIABLES
    uint cost = 0.001 ether;
    /**
     *  @notice Mapping used for store the URI of every token
     */
    mapping(uint => string) public tokenURI;

    /// FUNCTIONS
    /**
     *  @notice Constructor function that initialice the name and symbol of the token
     */
    function initialize(uint256 _supply) public initializer {
        __ERC20_init('RewardToken', 'RT');
        __Ownable_init();
        
        _mint(msg.sender, _supply);
    }

    /**
     *  @notice Function that allows mint the token
     *  @param _mintAmount is the amount of tokens to be minted
     */
    function mint(uint _mintAmount) payable public {
        require(msg.value >= cost * _mintAmount, "Insufficient funds!");
        _mint(msg.sender, _mintAmount);
    }

    /**
     *  @notice Function that overrides the ERC20 decimals to set decimals in 0
     *  @notice This sets the min quantity of tokens in 1
     */
    function decimals() public view virtual override(ERC20Upgradeable) returns (uint8) {
        return 18;
    }

    /**
     *  @notice Function that allow the owner to withdraw all the funds
     */
    function withdraw() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success);
    }
}