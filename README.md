# UniswapV2 Price Oracle Contract

A robust Solidity smart contract implementation for fetching real-time token prices from UniswapV2 pairs.

## Technical Overview

The UniswapV2PriceOracle contract provides price discovery functionality for any ERC20 token that has a liquidity pair with WETH on UniswapV2. The contract uses reserve ratios from liquidity pools to calculate token prices.

### Key Features

- Single token price queries
- Batch token price queries
- Price calculations in both token/ETH and ETH/token ratios
- Automatic decimal handling for different token standards
- Event emission for price updates

### Core Functions

1. **getPairAddress(address tokenA, address tokenB)**
   - Returns the UniswapV2 pair address for given token pairs
   - View function that queries the UniswapV2Factory

2. **getTokenPrice(address token)**
   - Returns tuple of (tokenPrice, ethPrice, symbol)
   - Handles decimal normalization
   - Emits PriceUpdated event
   - Returns prices in 18 decimal precision

3. **getMultipleTokenPrices(address[] tokens)**
   - Batch processing function for multiple tokens
   - Returns arrays of prices and symbols
   - Gas-efficient implementation for multiple queries

### Architecture

The contract interfaces with:
- IUniswapV2Factory: For pair address discovery
- IUniswapV2Pair: For accessing pool reserves
- IERC20: For token metadata (decimals, symbols)

### Price Calculation Methodology

Prices are calculated using the following formula:
- Token/ETH price = (reserve_token * 10^18) / reserve_eth
- ETH/Token price = (reserve_eth * 10^token_decimals) / reserve_token

## Technical Requirements

- Solidity ^0.8.27
- UniswapV2 compatible network
- WETH token address
- UniswapV2 Factory address

## Deployment

The contract requires two constructor parameters:
1. WETH address
2. UniswapV2 Factory address

## Security Considerations

- Relies on UniswapV2 liquidity for accuracy
- No price manipulation protection
- Uses instantaneous prices (no TWAP)
- External calls to token contracts

## Future Enhancements
- Add TWAP functionality
- Implement price manipulation protection
- Support more token standards
- Add batch token price queries

## Contribution

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
