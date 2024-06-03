const validations = require("./validations");
const utils = require("./utils");

/**
 * Pull and calculate the value of liquidity pool (LP) tokens for a specific address in Uniswap V3.
 *
 * @param {String} pool_address - Contract address of the liquidity pool token in Ethereum mainnet
 * @param {String} user_address - User address in Ethereum mainnet
 * @returns {Object} - token_0, token_1, token_0_symbol, token1_symbol, token_0_value, token_1_value,
 *                     token_0_fees, token_1_fees, fee_tier, nft_id, min_tick, max_tick
 */
async function calculate_lp(pool_address, user_address) {
    let token_0;
    let token_1;
    let fee_tier;

    if (
        validations.is_address_valid(pool_address, "lp") &&
        validations.is_address_valid(user_address, "user's wallet")
    ) {
        try {
            const is_pool_address_valid =
                await validations.is_pool_address_valid(pool_address);

            if (is_pool_address_valid) {
                const pool_details = await utils.get_pool(pool_address);

                token_0 = pool_details.token_0;
                token_1 = pool_details.token_1;
                fee_tier = Number(pool_details.fee_tier);

                const token_symbols = await utils.get_token_symbols(
                    token_0,
                    token_1
                );
                const token_values = await utils.get_token_values(
                    pool_address,
                    token_0,
                    token_1
                );
                const position_ids = await utils.get_position_ids(user_address);
                const position = await utils.get_position(
                    position_ids,
                    token_0,
                    token_1,
                    fee_tier
                );
                const unclaimed_token_fees =
                    await utils.get_unclaimed_token_fees(
                        position.id,
                        user_address,
                        token_0,
                        token_1
                    );

                return {
                    token_0: token_0,
                    token_1: token_1,
                    token_0_symbol: token_symbols.token_0_symbol,
                    token_1_symbol: token_symbols.token_1_symbol,
                    token_0_value: token_values.token_0_value,
                    token_1_value: token_values.token_1_value,
                    token_0_fees: unclaimed_token_fees.token_0_fees,
                    token_1_fees: unclaimed_token_fees.token_1_fees,
                    fee_tier: fee_tier,
                    nft_id: position.position_id,
                    min_tick: position.min_tick,
                    max_tick: position.max_tick,
                };
            }
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = {
    calculate_lp,
};
