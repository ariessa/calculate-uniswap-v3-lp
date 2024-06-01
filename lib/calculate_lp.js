const { ethers } = require("ethers");

/**
 * TODO: Write details for the function
 * TODO: Time complexity of the function
 * TODO: Space complexity of the function
 *
 * @param {String} lp_token_address - Contract address of the liquidity provider token
 * @param {String} wallet_address - Wallet address
 * @returns {Object} token0, token1, token0_value, token1_value, token0_fees, token1_fees
 */
function calculate_lp(lp_token_address, wallet_address) {
    // {
    //     "token0" : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    //     "token1" : "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3",
    //     "token0_value" : "1310550000000000000000",
    //     "token1_value" : "113000000000000000",
    //     "token0_fees" : "11000000000000000",
    //     "token1_fees" : "1100000000000",
    // }
    // TODO: Validate lp_token_address
    // TODO: Validate wallet_address
}

module.exports = calculate_lp;
