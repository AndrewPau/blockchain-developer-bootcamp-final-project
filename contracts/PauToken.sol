// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Pau Token
/// @author Andrew Pau
/// @notice This is a dummy ERC20 implementation, which mints on deploy. It allows for
///         purchasing for up to 20 tokens at a time, and withdrawals from the owner.
contract PauToken is ERC20, Ownable {

    event PurchaseToken(address indexed addr, uint256 amount);
    event WithdrawFunds(address indexed addr, uint256 amount);

    uint256 public startingPrice;
    uint256 public purchaseLimit;

    fallback () external payable {
      revert();
    }

    receive () external payable {
      revert();
    }

    /// @notice User can only withdraw if there are funds available
    modifier withdrawFunds() {
        require(address(this).balance > 0, "no funds to withdraw");
        _;
    }

    /// @notice Ensures the buyer purchases a valid amount of tokens
    /// @param _amount The amount of tokens to purchase
    modifier validateAmount(uint256 _amount) {
        require(_amount > 0 && _amount <= purchaseLimit, "not within purchase limit");
        require(_amount * 10 ** decimals() <= balanceOf(address(this)), "not enough tokens left to purchase");
        _;
    }

    /// @notice Ensures the buyer has paid enough
    /// @notice _amount The amount of tokens to purchase
    modifier paidEnough(uint256 _amount) {
        require(_amount * startingPrice <= msg.value, "did not pay enough");
        _;
    }

    /// @notice Refunds the excess amount paid to the buyer
    /// @notice _amount The amount of tokens to purchase
    modifier refundExcess(uint256 _amount) {
        _;
        uint256 amountToRefund = msg.value - _amount * startingPrice;
        payable(msg.sender).transfer(amountToRefund);
    }

    /// @notice Mints an initial supply, and sets a price and purchase limit
    /// @param initialSupply The initial supply for Pau Token
    constructor(uint256 initialSupply) ERC20("Pau Token", "PAU") {
        _mint(address(this), initialSupply * 10 ** decimals());
        startingPrice = 10 ** (decimals()-2);
        purchaseLimit = 20;
    }

    /// @notice Allows any arbitrary user to purchase up to 20 tokens
    /// @param amount The number of tokens to purchase
    /// @return Boolean representing whether the operation is successful
    function purchaseToken(uint256 amount) public payable validateAmount(amount) paidEnough(amount) refundExcess(amount) returns (bool) {
        (bool sent) = this.transfer(msg.sender, amount * 10 ** decimals());
        require(sent, "Transfer failed");

        emit PurchaseToken(msg.sender, amount * 10 ** decimals());

        return true;
    }

    /// @notice Allows the user to withdraw all funds on the contract
    /// @return Boolean representing whether the operation is successful
    function withdraw() public onlyOwner withdrawFunds returns (bool) {
        uint256 balance = address(this).balance;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed.");

        emit WithdrawFunds(msg.sender, balance);
        return true;
    }
}
