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