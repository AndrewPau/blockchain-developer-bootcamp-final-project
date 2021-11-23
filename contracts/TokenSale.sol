// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenSale {

    event SellToken(address indexed addr, uint32 amount);

    address owner;
    uint256 startingPrice;
    uint256 purchaseLimit;
    mapping (address => bool) previousBuyers;

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier presaleQualified() {
        // Validation 
        _;
    }

    modifier paidEnough(uint _amount) {
        // Validation
        _;
    }

    modifier refundExcess(uint _amount) {
        _;
        // Calculate refund amount, if applicable
    }

    constructor(uint256 _startingPrice, uint256 _purchaseLimit) {
        owner = msg.sender;
        startingPrice = _startingPrice;
        purchaseLimit = _purchaseLimit;
    }

    function purchasePresaleToken(uint32 amount) public payable presaleQualified {
        // Validate the user, purchase the tokens, refund any excess, and send tokens to user
    }

    function connectWallet() private {
        // Prompt the user to connect their wallet
        // TODO: Implement other methods we may need, such as msg signing
    }
}
