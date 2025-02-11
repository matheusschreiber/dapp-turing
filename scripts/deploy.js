const hre = require("hardhat");

async function main() {

    // ethers is avaialble in the global scope
    const [deployer] = await hre.ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Turing = await hre.ethers.getContractFactory("Turing");
    const contract = await Turing.deploy();
    await contract.deployed();
  
    console.log("Token address:", contract.address);
  
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  