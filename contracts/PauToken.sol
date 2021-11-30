// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PauToken is ERC20 {

    event PurchaseToken(address indexed addr, uint256 amount);
    event WithdrawFunds(address indexed addr);

    address public owner;
    uint256 public startingPrice;
    uint256 public purchaseLimit;

    fallback () external payable {
      revert();
    }

    receive () external payable {
      revert();
    }

    modifier isOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier withdrawFunds() {
        require(address(this).balance > 0, "no funds to withdraw");
        _;
    }

    modifier validateAmount(uint256 _amount) {
        require(_amount > 0 && _amount <= purchaseLimit, "not within purchase limit");
        require(_amount * 10 ** decimals() <= balanceOf(address(this)), "not enough tokens left to purchase");
        _;
    }

    modifier paidEnough(uint256 _amount) {
        require(_amount * startingPrice <= msg.value, "did not pay enough");
        _;
    }

    modifier refundExcess(uint256 _amount) {
        _;
        uint256 amountToRefund = msg.value - _amount * startingPrice;
        payable(msg.sender).transfer(amountToRefund);
    }

    constructor(uint256 initialSupply) ERC20("Pau Token", "PAU") {
        owner = msg.sender;
        _mint(address(this), initialSupply * 10 ** decimals());
        startingPrice = 10 ** (decimals()-2);
        purchaseLimit = 20;
    }

    function purchaseToken(uint256 amount) public payable validateAmount(amount) paidEnough(amount) refundExcess(amount) returns (bool) {
        (bool sent) = this.transfer(msg.sender, amount * 10 ** decimals());
        require(sent, "Transfer failed");

        emit PurchaseToken(msg.sender, amount * 10 ** decimals());

        return true;
    }

    // function withdraw() public isOwner withdrawFunds {
    //     (bool sent,) = msg.sender.call{value: address(this).balance}("");
    //     require(sent, "Withdraw failed");

    //     emit WithdrawFunds(msg.sender);
    // }
}
