# 🎰 Ethereum Lottery Smart Contract

This project is a **decentralized lottery smart contract** built on Ethereum using **Solidity** and **Hardhat**. Players can enter the lottery by sending ETH, and a winner is randomly selected to receive the entire prize pool.

---

## 🚀 Features

- Players enter by sending a fixed **entry fee** (e.g., 0.01 ETH)
- Random winner selection using **block.prevrandao** (PoS-compatible)
- Only the contract **owner** can trigger the lottery draw
- Fully tested using **Hardhat & Chai**
- **Deployable** on the **Sepolia testnet**

---


1. **Clone the repository:**

   ```sh
   git clone https://github.com/DevFreAkeD/lottery-smart-contract.git
   cd lottery-smart-contract
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up Hardhat:**

   ```sh
   npx hardhat
   ```

   Select **"Create a basic sample project"** if prompted.

---

## 📜 Smart Contract (Solidity)

Create `contracts/Lottery.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    address public owner;
    address[] public players;
    uint public entryFee;
    
    constructor(uint _entryFee) {
        owner = msg.sender;
        entryFee = _entryFee;
    }

    function enter() public payable {
        require(msg.value == entryFee, "Incorrect entry fee");
        players.push(msg.sender);
    }

    function pickWinner() public onlyOwner {
        require(players.length > 0, "No players joined");
        uint winnerIndex = random() % players.length;
        address winner = players[winnerIndex];
        payable(winner).transfer(address(this).balance);
        delete players;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, players.length)));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
}
```

---

## 🔧 Compile the Contract

Run:

```sh
npx hardhat compile
```

You should see **"Compilation finished successfully"**.

---

## 🚀 Deploy the Contract

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
    const entryFee = hre.ethers.parseEther("0.01"); // 0.01 ETH entry fee
    const Lottery = await hre.ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(entryFee);
    await lottery.waitForDeployment();
    
    console.log(`Lottery deployed to: ${lottery.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

### **Deploy Locally:**

```sh
npx hardhat run scripts/deploy.js --network hardhat
```

### **Deploy on Sepolia Testnet:**

1. **Get Sepolia test ETH** from:
   - [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
   - [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)
2. **Set up `hardhat.config.js`**:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  },
  solidity: "0.8.19",
};
```

3. **Deploy:**

```sh
npx hardhat run scripts/deploy.js --network sepolia
```

---

## ✅ Run Tests

To ensure the contract works as expected, run:

```sh
npx hardhat test
```

Create `test/Lottery.js`:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function () {
    let Lottery, lottery, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Lottery = await ethers.getContractFactory("Lottery");
        lottery = await Lottery.deploy(ethers.parseEther("0.01"));
    });

    it("should allow players to enter", async function () {
        await lottery.connect(addr1).enter({ value: ethers.parseEther("0.01") });
        expect(await lottery.players(0)).to.equal(addr1.address);
    });

    it("should only allow the owner to pick a winner", async function () {
        await expect(lottery.connect(addr1).pickWinner()).to.be.revertedWith("Only owner can call this");
    });
});
```
📢 Connect with Me

💬 Let's discuss blockchain & Web3! Connect with me on LinkedIn or Twitter.