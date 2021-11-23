// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenGeneration{

    event GenerateToken(uint32 indexed amount);
    event SendToken(address indexed addr);

    address owner;
    uint32 initialSupply;

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
        initialSupply = 1000000;
    }

    function generateTokens() public isOwner() {
        // Generate the initial token supply
    }

    function sendTokens(address addr) public isOwner() {
        // Send tokens to a specified address
    }
}
