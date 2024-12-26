// Importing necessary functionalities from the Hardhat package.
import { ethers } from 'hardhat'

async function main() {
  // Retrieve the first signer, typically the default account in Hardhat, to use as the deployer.
  const [deployer] = await ethers.getSigners();
  const weth = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
  const uniswapv2factory = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";
  const uniswapV2PriceOracle = await ethers.deployContract("UniswapV2PriceOracle", [weth, uniswapv2factory]);
  await uniswapV2PriceOracle.waitForDeployment();
  console.log(`Deploying contract with the account: ${deployer.address}`);
  
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