const hre = require("hardhat");

async function main() {
    const entryFee = hre.ethers.parseEther("0.01"); // 0.01ETH entry fee(you can change it)
    const Lottery = await hre.ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(entryFee);
    await lottery.waitForDeployment();

    console.log(`Lottery deployed to: ${lottery.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});