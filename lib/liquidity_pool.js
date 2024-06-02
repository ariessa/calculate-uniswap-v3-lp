const { ethers } = require("ethers");
const validations = require("./validations");

/**
 * Pull and calculate the value of liquidity pool (LP) tokens for a specific address in Uniswap V3.
 *
 * @param {String} lp_address - Contract address of the liquidity pool token
 * @param {String} wallet_address - Wallet address
 * @returns {Object} token0, token1, token0_value, token1_value, token0_fees, token1_fees
 */
async function calculate_lp(lp_address, wallet_address, provider) {
    // Validate lp_address and wallet_address
    if (validations.is_address_valid(lp_address, 'lp') && validations.is_address_valid(wallet_address, 'user\'s wallet')) {
        // TODO: Check if a liquidity pool address exists or not
    }
}

module.exports = { 
    calculate_lp 
};

calculate_lp().then(r => console.log("r: ", r));

