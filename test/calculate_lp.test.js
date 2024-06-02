const { get_lp_addresses, calculate_lp } = require('../lib/liquidity_pool');
const { hardhat_provider, mainnet_provider, testnet_provider } = require("../constants/providers");

describe("function calculate_lp", () => {
    beforeAll(() => {
        // Fork mainnet if tests are run against mainnet
        // Fork testnet if tests are run against testnet
        // TODO: Deploy contract UniswapV3LPAddresses
    });
      
    test("returns error if liquidity pool's address is invalid", async () => {
        // calculate_lp();
        console.log("get_lp_addresses: ", await get_lp_addresses());
        // console.log("calculate_lp: ", calculate_lp("0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97", "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97", mainnet_provider));
    });

    // test("returns error if user's address is invalid", () => {
    //     console.log("calculate_lp: ", calculate_lp);
    // });

    // test("returns error if fails to pull liquidity pool's details", () => {
    //     console.log("calculate_lp: ", calculate_lp);
    // });

    // test("can calculate the value of valid lp tokens", () => {
    // });

});