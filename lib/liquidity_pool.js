const { is_address_valid, is_lp_address_valid } = require("./validations");
const { lp_abi } = require("../constants/abi");
const { ethers } = require("ethers");
const env = require("../constants/env");
const utils = require("../lib/utils");

/**
 * Get a list of Uniswap V3 liquidity pool addresses.
 *
 * @param {String} provider - An interface that connects to the Ethereum blockchain (hardhat, mainnet, testnet)
 * @returns {String[]} Array of Uniswap V3 liquidity pool addresses
 */
async function get_lp_addresses() {
}

/**
 * Pull and calculate the value of liquidity pool (LP) tokens for a specific address in Uniswap V3.
 *
 * @param {String} lp_address - Contract address of the liquidity pool token
 * @param {String} wallet_address - Wallet address
 * @returns {Object} token0, token1, token0_value, token1_value, token0_fees, token1_fees
 */
async function calculate_lp(lp_address, wallet_address, provider) {
    // Validate lp_address and wallet_address
    if (is_address_valid(lp_address, 'lp') && is_address_valid(wallet_address, 'user\'s wallet')) {
        // TODO: Implement a function to pull LP token details for specific addresses from Uniswap V3.
        // TODO: Validate V3 Pool Contract


        // if (is_lp_address_valid(lp_address)) {
        // if (true) {
        //     const lp_contract = new ethers.Contract(lp_address, lp_abi, provider);
        //     console.log("LP Contract: ", lp_contract);
    
        //     // Retrieve LP token balance for the address
        //     const lp_balance = await lp_contract.balanceOf(wallet_address);
        //     console.log("LP Token Balance: ", lp_balance.toString());

        //     // TODO: Get current price of

        //     return 1;
    
        //     // TODO: Design the function to calculate the current value of LP tokens based on provided parameters.
        //     // TODO: Consider factors like token balances, prices, and fees.
        //     // TODO: Ensure proper error handling for cases like invalid LP tokens or failed interactions.
        //     // Sample output
        //     // {
        //     //     "token0" : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        //     //     "token1" : "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3",
        //     //     "token0_value" : "1310550000000000000000",
        //     //     "token1_value" : "113000000000000000",
        //     //     "token0_fees" : "11000000000000000",
        //     //     "token1_fees" : "1100000000000",
        //     // }
            
        // }
    }
}

module.exports = { 
    get_lp_addresses, 
    calculate_lp 
};

get_lp_addresses().then(r => console.log("r: ", r));

