// Importing necessary functionalities from the Hardhat package.
import { ethers } from 'hardhat'

async function main() {
  // Retrieve the first signer, typically the default account in Hardhat, to use as the deployer.
  const [deployer] = await ethers.getSigners();
  const uniswapV2PriceOracle = await ethers.deployContract("UniswapV2PriceOracle");
  await uniswapV2PriceOracle.waitForDeployment()
  const UniswapV2PriceOracle_Address = await uniswapV2PriceOracle.getAddress();
  console.log(`UniswapV2PriceOracle is deployed. ${UniswapV2PriceOracle_Address}`);
}

// This pattern allows the use of async/await throughout and ensures that errors are caught and handled properly.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })