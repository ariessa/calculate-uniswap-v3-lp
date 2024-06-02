const { ethers } = require("ethers");
const constants = require("./constants");

/**
 * Checks whether an address is a valid Ethereum address or not.
 *
 * @param {String} address - An address to be validated.
 * @param {String} tag - A tag that describes the address, to be used in an error message.
 * @returns {Boolean} The result of address validation.
 */
function is_address_valid(address, tag) {
    if (!ethers.isAddress(address)) {
        throw new Error(`Invalid address for ${tag}!`);
    }

    return true;
}

/**
 * Checks whether a liquidity pool's address is a valid Uniswap V3 liquidity pool's address or not.
 *
 * @param {String} address - A liquidity pool's address to be validated.
 * @returns {Boolean} The result of liquidity pool's address validation.
 */
async function is_lp_address_valid(address) {
    const contract = new ethers.Contract(constants.UNISWAP_V3_LP_ADDRESSES_ADDRESS, constants.UNISWAP_V3_LP_ADDRESSES_ABI, constants.TESTNET_PROVIDER);

    try {
        // Check if liquidity pool's address exists or not
        await contract.get_liquidity_pool(address).then(r => {
            return true;
    });
    } catch (e) {
        return false;
    }
}

module.exports = {
    is_address_valid, 
    is_lp_address_valid
};
