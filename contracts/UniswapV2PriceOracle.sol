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

    function getPairAddress(
        address tokenA,
        address tokenB
    ) public view returns (address) {
        return
            IUniswapV2Factory(UNISWAP_V2_FACTORY_ADDRESS).getPair(
                tokenA,
                tokenB
            );
    }

    function getTokenPrice(
        address token
    )
        public
        returns (uint256 tokenPrice, uint256 ethPrice, string memory symbol)
    {
        address pairAddress = getPairAddress(token, WETH);
        IUniswapV2Pair pairContract = IUniswapV2Pair(pairAddress);

        (uint112 reserve0, uint112 reserve1, ) = pairContract.getReserves();
        address token0 = pairContract.token0();
        address token1 = pairContract.token1();

        uint8 tokenDecimals = IERC20(token).decimals();
        symbol = IERC20(token).symbol();

        if (token0 == WETH) {
            ethPrice = (reserve0 * (10 ** tokenDecimals)) / reserve1;
            tokenPrice = (reserve1 * (10 ** 18)) / reserve0;
        } else if (token1 == token) {
            ethPrice = (reserve1 * (10 ** tokenDecimals)) / reserve0;
            tokenPrice = (reserve0 * (10 ** 18)) / reserve1;
        }

        emit PriceUpdated(token, tokenPrice, ethPrice, symbol);
    }

    function getMultipleTokenPrices(
        address[] calldata tokens
    )
        external
        returns (
            uint256[] memory tokenPrices,
            uint256[] memory ethPrices,
            string[] memory symbols
        )
    {
        uint256 length = tokens.length;
        tokenPrices = new uint256[](length);
        ethPrices = new uint256[](length);
        symbols = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            (tokenPrices[i], ethPrices[i], symbols[i]) = getTokenPrice(tokens[i]);
        }
    }
}
