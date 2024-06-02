const utils = require("../lib/utils");
const constants = require("../lib/constants");
const { ethers } = require("ethers");

/**
 * Process 5000 blocks then sleep for 2 seconds.
 * If the contract UniswapV3LPAddresses was just deployed on Sepolia testnet,
 * it will start filtering event logs starting from the block number when contract UniswapV3Factory was created on mainnet.
 * Else, it will filter event logs starting from the last processed block.
 */
async function populate_data() {   
    const contract = new ethers.Contract(constants.UNISWAP_V3_FACTORY_ADDRESS, constants.UNISWAP_V3_FACTORY_EVENT_POOL_CREATED, constants.MAINNET_PROVIDER);
    const filter = contract.filters.PoolCreated;
    const last_finalised_block = await utils.get_last_finalised_block();
    const last_processed_block = await utils.get_last_processed_block();

    for (let i = last_processed_block; i <= last_finalised_block; i += 5000) {
        let lp_address = [];
        let token_a = [];
        let token_b = [];
        let fee = [];
        let block_number = [];
        let lowest_block_number;

        try {
            // Get event logs
            const logs = await contract.queryFilter(filter, i, i + 5000);

            if (logs.length != 0) {
                for (let j = 0; j < logs.length; j++) {
                    lp_address.push(logs[j].args[4]);
                    token_a.push(logs[j].args[0]);
                    token_b.push(logs[j].args[1]);
                    fee.push(parseInt((logs[j].args[2]).toString()));
                    block_number.push(logs[j].blockNumber);
                }

                lowest_block_number = Math.min(...block_number);

                // Add liquidity pools to contract UniswapV3LPAddresses on Sepolia testnet
                await utils.batch_add_liquidity_pool(lp_address, token_a, token_b, fee, lowest_block_number);
            }
        } catch (error) {
            console.error("Error fetching event logs:", error);
        }
        utils.sleep(2000);
    }
}

populate_data();
