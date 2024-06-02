const validations = require("./validations");
const utils = require("./utils");
/**
 * Pull and calculate the value of liquidity pool (LP) tokens for a specific address in Uniswap V3.
 *
 * @param {String} lp_address - Contract address of the liquidity pool token
 * @param {String} wallet_address - Wallet address
 * @returns {Object} token0, token1, token0_value, token1_value, token0_fees, token1_fees, total_lp_value
 */
async function calculate_lp(lp_address, wallet_address) {
    let token_0;
    let token_1;
    let total_lp_supply;
    let total_lp_balance;
    let token_0_value;
    let token_1_value;
    let token_0_fee;
    let token_1_fee;
    let token_0_amount;
    let token_1_amount;
    let total_lp_value;

    // Validate lp_address and wallet_address
    if (validations.is_address_valid(lp_address, 'lp') && validations.is_address_valid(wallet_address, 'user\'s wallet')) {
        // Check if a liquidity pool address exists or not
        await validations.is_lp_address_valid(lp_address).then(async res => {
            if (res) {
                const lp_details = await utils.get_liquidity_pool(lp_address);

                token_0 = await lp_details.token_0;
                token_1 = await lp_details.token_1;

                const total_lp = await utils.get_total_lp(lp_address, wallet_address);
                const token_values = await utils.get_token_values(lp_address, token_0, token_1);
                const token_fees = await utils.get_token_fees(lp_address);
                const token_amounts = await utils.get_token_amounts(lp_address, token_0, token_1)

                total_lp_supply = await total_lp.total_lp_supply;
                total_lp_balance = await total_lp.total_lp_balance;
                token_0_value = await token_values.token_0_value;
                token_1_value = await token_values.token_1_value;
                token_0_fee = await token_fees.token_0_fee;
                token_1_fee = await token_fees.token_1_fee;
                token_0_amount = await token_amounts.token_0_amount;
                token_1_amount = await token_amounts.token_1_amount;

                console.log("token_0: ", token_0);
                console.log("token_1: ", token_1);
                console.log("total_lp_supply: ", total_lp_supply);
                console.log("total_lp_balance: ", total_lp_balance);
                console.log("token_0_value: ", token_0_value);
                console.log("token_1_value: ", token_1_value);
                console.log("token_0_fee: ", token_0_fee);
                console.log("token_1_fee: ", token_1_fee);
                console.log("token_0_amount: ", token_0_amount);
                console.log("token_1_amount: ", token_1_amount);

                // Calculate total LP token value
                total_lp_value = token_0_value.add(token_1_value);

                console.log("total_lp_value: ", total_lp_value);
            
                return {
                    token_0: token_0,
                    token_1: token_1,
                    token_0_value: token_0_value,
                    token_1_value: token_1_value,
                    token_0_fee: token_0_fee,
                    token_1_fee: token_1_fee,
                    total_lp_value: total_lp_value
                }
            }
        });
    }
}

module.exports = { 
    calculate_lp 
};
