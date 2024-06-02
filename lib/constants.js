require('dotenv').config();

const { ethers } = require("ethers");

module.exports = {
    ETHERSCAN_MAINNET_URL: process.env.ETHERSCAN_MAINNET_URL,
    ETHERSCAN_TESTNET_URL: process.env.ETHERSCAN_TESTNET_URL,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    UNISWAP_V3_LP_ADDRESSES_ADDRESS: process.env.UNISWAP_V3_LP_ADDRESSES_ADDRESS,
    INFURA_MAINNET_URL: process.env.INFURA_MAINNET_URL,
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    UNISWAP_V3_FACTORY_ADDRESS: process.env.UNISWAP_V3_FACTORY_ADDRESS,
    UNISWAP_V3_FACTORY_TOPIC0: process.env.UNISWAP_V3_FACTORY_TOPIC0,
    UNISWAP_V3_FACTORY_ABI: {
        abi
      } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'),
    UNISWAP_V3_POOL_ABI: {
        abi
      } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'),
    UNISWAP_V3_LP_ADDRESSES_ABI: {
      abi 
    } = require('../abi/UniswapV3LPAddresses.json'),
    UNISWAP_V3_LP_ADDRESSES_EVENT: ["event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)"], 
    WALLET_TESTNET_PRIVATE_KEY: process.env.WALLET_TESTNET_PRIVATE_KEY,
    MAINNET_PROVIDER: new ethers.JsonRpcProvider(`${process.env.INFURA_MAINNET_URL}${process.env.INFURA_API_KEY}`), 
    TESTNET_PROVIDER: new ethers.JsonRpcProvider(`${process.env.INFURA_TESTNET_URL}${process.env.INFURA_API_KEY}`)
};