import { expect } from "chai";
import { ethers } from "hardhat";
import { Event } from '@ethersproject/contracts';

describe("UniswapV2PriceOracle", function () {
  let priceOracle: any;
  let weth: any;
  let factory: any;
  let owner: any;
  let testToken: any;
  let pair: any;

  // Constants for Mainnet addresses
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const UNISWAP_FACTORY = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // Example token

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    // Deploy the UniswapV2PriceOracle contract
    const UniswapV2PriceOracle = await ethers.getContractFactory("UniswapV2PriceOracle");
    priceOracle = await UniswapV2PriceOracle.deploy(WETH_ADDRESS, UNISWAP_FACTORY);
    await priceOracle.deployed();

    // Get contract instances for existing contracts
    weth = await ethers.getContractAt("IERC20", WETH_ADDRESS);
    factory = await ethers.getContractAt("IUniswapV2Factory", UNISWAP_FACTORY);
  });

  // Test cases for UniswapV2PriceOracle contract
  // Test case for initialization
  describe("Constructor", function () {
    it("Should set WETH address correctly", async function () {
      expect(await priceOracle.WETH()).to.equal(WETH_ADDRESS);
    });

    it("Should set Uniswap Factory address correctly", async function () {
      expect(await priceOracle.UNISWAP_V2_FACTORY_ADDRESS()).to.equal(UNISWAP_FACTORY);
    });
  });

// Test case for getPairAddress
  describe("getPairAddress", function () {
    it("Should return correct pair address for WETH-DAI", async function () {
      const pairAddress = await priceOracle.getPairAddress(WETH_ADDRESS, DAI_ADDRESS);
      const factoryPair = await factory.getPair(WETH_ADDRESS, DAI_ADDRESS);
      expect(pairAddress).to.equal(factoryPair);
    });
  });

  describe("getTokenPrice", function () {
    it("Should return token price and emit PriceUpdated event", async function () {
      const tx = await priceOracle.getTokenPrice(DAI_ADDRESS);
      const receipt = await tx.wait();

      // Check if PriceUpdated event was emitted
      const event = receipt.events?.find((e: Event) => e.event === 'PriceUpdated');
      expect(event).to.not.be.undefined;

      // Verify event parameters
      expect(event.args.token).to.equal(DAI_ADDRESS);
      expect(event.args.tokenPrice).to.not.equal(0);
      expect(event.args.ethPrice).to.not.equal(0);
      expect(event.args.tokenSymbol).to.equal("DAI");
    });
  });

  describe("getMultipleTokenPrices", function () {
    it("Should return prices for multiple tokens", async function () {
      const tokens = [DAI_ADDRESS];
      const [tokenPrices, ethPrices, symbols] = await priceOracle.getMultipleTokenPrices(tokens);

      expect(tokenPrices.length).to.equal(1);
      expect(ethPrices.length).to.equal(1);
      expect(symbols.length).to.equal(1);

      expect(tokenPrices[0]).to.not.equal(0);
      expect(ethPrices[0]).to.not.equal(0);
      expect(symbols[0]).to.equal("DAI");
    });
  });
});
