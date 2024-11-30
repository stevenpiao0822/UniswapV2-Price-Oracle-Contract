//SPDX-License-Identifier:MIT
pragma solidity ^0.8.27;

interface IUniswapV2Factory {
    function getPair(
        address tokenA,
        address tokenB
    ) external view returns (address pair);
}

interface IUniswapV2Pair {
    function getReserves()
        external
        view
        returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function token0() external view returns (address);
    function token1() external view returns (address);
}

interface IERC20 {
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
}

contract UniswapV2PriceOracle {
    address public immutable WETH;
    address public immutable UNISWAP_V2_FACTORY_ADDRESS;

    event PriceUpdated(
        address indexed token,
        uint256 tokenPrice,
        uint256 ethPrice,
        string tokenSymbol
    );

    constructor(address _WETH, address _UNISWAP_V2_FACTORY_ADDRESS) {
        WETH = _WETH;
        UNISWAP_V2_FACTORY_ADDRESS = _UNISWAP_V2_FACTORY_ADDRESS;
    }

    function getPairAddress(address token) public view returns (address) {
      return IUniswapV2Factory(UNISWAP_V2_FACTORY_ADDRESS).getPair(token, WETH);
    }
}
