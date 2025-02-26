// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    address public owner;
    address[] public players;
    uint public entryFee;

    constructor(uint _entryfee) {
        owner = msg.sender;
        entryFee = _entryfee;
    }

    function enter() public payable {
        require(msg.value == entryFee, "Incorrect entry fee");
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, players.length)));
    }

    function pickWinner() public onlyOwner {
        require(players.length > 0, "No Players Joined.");
        uint winnerIndex = random() % players.length;
        address winner = players[winnerIndex];
        payable(winner).transfer(address(this).balance);
        delete players;
    }

    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
}