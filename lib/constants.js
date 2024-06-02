require('dotenv').config();

const { ethers } = require("ethers");

module.exports = {
    ETHERSCAN_MAINNET_URL: process.env.ETHERSCAN_MAINNET_URL,
    ETHERSCAN_TESTNET_URL: process.env.ETHERSCAN_TESTNET_URL,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    ETHERSCAN_FROM_BLOCK: process.env.ETHERSCAN_FROM_BLOCK,
    ETHERSCAN_TO_BLOCK: process.env.ETHERSCAN_TO_BLOCK,
    ETHERSCAN_BROWSER_TESTNET_URL: process.env.ETHERSCAN_BROWSER_TESTNET_URL,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    INFURA_MAINNET_URL: process.env.INFURA_MAINNET_URL,
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    UNISWAP_V3_FACTORY_ADDRESS: process.env.UNISWAP_V3_FACTORY_ADDRESS,
    UNISWAP_V3_FACTORY_TOPIC0: process.env.UNISWAP_V3_FACTORY_TOPIC0,
    UNISWAP_V3_FACTORY_ABI: {
        abi
      } =  require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'),
    WALLET_TESTNET_PRIVATE_KEY: process.env.WALLET_TESTNET_PRIVATE_KEY,
    mainnet_provider: new ethers.JsonRpcProvider(`${process.env.INFURA_MAINNET_URL}${process.env.INFURA_API_KEY}`), 
    testnet_provider: new ethers.JsonRpcProvider(`${process.env.INFURA_TESTNET_URL}${process.env.INFURA_API_KEY}`)
};