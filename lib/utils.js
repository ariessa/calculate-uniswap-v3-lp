const constants = require("./constants");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

/**
 * Pauses execution for a specified duration.
 * @param {number} milliseconds - The duration to sleep in milliseconds.
 * @returns {Promise<void>} - A Promise that resolves after the specified duration.
 */
async function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Updates a line in a specified file with a new value.
 * @param {string} file_path - The path to the file to be updated.
 * @param {string} pattern - The pattern or text to search for in the file.
 * @param {string} new_value - The new value to replace the matched line.
 * @throws {Error} - Throws an error if there are any issues with file operations.
 */
function update_contract_address(file_path, pattern, new_value) {
    try {
        // Read the content of the .env file synchronously
        let data = fs.readFileSync(file_path, "utf8");

        // Split the content into lines
        const lines = data.split("\n");

        // Find the line that matches the pattern
        const index = lines.findIndex((line) => line.includes(pattern));

        if (index !== -1) {
            // Update the line with the new value
            lines[index] = new_value;
            const updatedContent = lines.join("\n");

            // Write the updated content back to the .env file synchronously
            fs.writeFileSync(file_path, updatedContent, "utf8");
            console.log("Line updated successfully.");
        } else {
            console.log("No matching line found in .env file.");
        }
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Updates a line in a specified file with a new value.
 * @param {string} file_path - The path to the file to be updated.
 * @param {string} pattern - The pattern or text to search for in the file.
 * @param {string} newValue - The new value to replace the matched line.
 * @throws {Error} - Throws an error if there are any issues with file operations.
 */
function create_json_file(input_file_path, file_name, output_file_path) {
    // Read the input JSON file synchronously
    try {
        if (file_name == "input.json" && input_file_path == "") {
            // Read the directory synchronously
            const files = fs.readdirSync("artifacts/build-info/");

            // Filter JSON files with a dynamic name
            const jsonFile = files.find(
                (file) => path.extname(file) === ".json"
            );

            if (!jsonFile) {
                console.error(
                    "No JSON file found in the directory matching the criteria."
                );
                return;
            }

            // Construct the full path of the JSON file
            input_file_path = path.join("artifacts/build-info/", jsonFile);
        }
        // Check if the file exists
        if (!fs.existsSync(input_file_path)) {
            console.error("File does not exist:", input_file_path);
            return;
        }

        const data = fs.readFileSync(input_file_path, "utf8");

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Extract the desired values from the JSON data
        const extractedValues = jsonData.abi;

        // Convert the extracted values to JSON string
        const jsonString = JSON.stringify(extractedValues, null, 2);

        // Write the JSON string to a new JSON file synchronously
        fs.writeFileSync(output_file_path, jsonString, "utf8");
        console.log(`File ${file_name} created successfully.`);
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Retrieves the block number at which a smart contract was created.
 * @param {string} contract_address - The Ethereum address of the smart contract.
 * @returns {Promise<number>} - A Promise that resolves to the block number of contract creation.
 */
async function get_contract_creation_block(contract_address) {
    // Get contract creation details
    const response = await fetch(
        `${constants.ETHERSCAN_MAINNET_URL}?module=contract&action=getcontractcreation&contractaddresses=${contract_address}&apikey=${constants.ETHERSCAN_API_KEY}`
    );
    const data = await response.json();
    const tx_hash = await data.result[0].txHash;

    // Get the transaction receipt for the transaction hash
    const receipt =
        await constants.MAINNET_PROVIDER.getTransactionReceipt(tx_hash);

    if (!receipt) {
        console.log("Transaction receipt not found.");
        return;
    }

    return receipt.blockNumber;
}

/**
 * Retrieves the block number of the last finalized block by subtracting 10 from the current latest finalized block number.
 * @returns {Promise<number>} - A Promise that resolves to the block number of the last finalized block.
 */
async function get_last_finalised_block() {
    // Get the current latest finalized block number on the Ethereum mainnet
    const latestFinalizedBlockNumber =
        await constants.MAINNET_PROVIDER.getBlockNumber();

    return latestFinalizedBlockNumber - 10;
}

/**
 * Retrieves the last processed block number from a smart contract using ethers.js.
 * @returns {Promise<number>} - A Promise that resolves to the last processed block number.
 */
async function get_last_processed_block() {
    const contract = new ethers.Contract(
        constants.UNISWAP_V3_POOL_ADDRESSES_ADDRESS,
        constants.UNISWAP_V3_POOL_ADDRESSES_ABI,
        constants.TESTNET_PROVIDER
    );
    const value = parseInt((await contract.get_last_block()).toString());

    return value;
}

/**
 * Retrieves details of a Uniswap V3 pool from contract on Sepolia testnet.
 * @param {string} pool_address - The address of the liquidity pool contract on the Ethereum mainnet.
 * @returns {Promise<{ token_0: string, token_1: string, fee_tier: number }>} - A Promise that resolves to an object containing the token addresses and fee tier of the liquidity pool.
 */
async function get_pool(pool_address) {
    const contract = new ethers.Contract(
        constants.UNISWAP_V3_POOL_ADDRESSES_ADDRESS,
        constants.UNISWAP_V3_POOL_ADDRESSES_ABI,
        constants.TESTNET_PROVIDER
    );
    const value = await contract.get_liquidity_pool(pool_address);

    return {
        token_0: value[0],
        token_1: value[1],
        fee_tier: value[2],
    };
}

/**
 * Retrieves details of a specific position from contract Uniswap V3 Nonfungible Manager on Ethereum mainnet.
 * @param {Array<number>} position_ids - Array of position IDs to retrieve details for.
 * @param {string} token_0 - Address of the first token in the position.
 * @param {string} token_1 - Address of the second token in the position.
 * @param {number} fee_tier - Fee tier associated with the position.
 * @returns {Promise<{ position_id: number, min_tick: number, max_tick: number }>} - A Promise that resolves to an object containing details of the matching position.
 */
async function get_position(position_ids, token_0, token_1, fee_tier) {
    const contract = new ethers.Contract(
        constants.UNISWAP_V3_NFT_POSITION_MANAGER_ADDRESS,
        constants.UNISWAP_V3_NFT_POSITION_MANAGER_ABI,
        constants.MAINNET_PROVIDER
    );

    const position_calls = [];

    for (let id of position_ids) {
        position_calls.push(contract.positions(id));
    }

    const positions = await Promise.all(position_calls);

    // Find the matching position based on token addresses and fee tier
    function find_matching_items(positions, token_0, token_1, fee_tier) {
        for (let i = 0; i < positions.length; i++) {
            if (
                positions[i][2] == token_0 &&
                positions[i][3] == token_1 &&
                positions[i][4] == fee_tier
            ) {
                return {
                    id: position_ids[i],
                    position: positions[i],
                };
            }
        }
    }

    const matching_position = find_matching_items(
        positions,
        token_0,
        token_1,
        fee_tier
    );

    return {
        position_id: Number(matching_position.id),
        min_tick: Number(matching_position.position[5]),
        max_tick: Number(matching_position.position[6]),
    };
}

/**
 * Retrieves the position ids owned by an address from contract Uniswap V3 Nonfungible Manager on Ethereum mainnet.
 * @param {string} user_address - The user address that owns the position ids.
 * @returns {Promise<Array<number>>} - A Promise that resolves to an array of position ids owned by the user, in reverse order.
 */
async function get_position_ids(user_address) {
    const contract = new ethers.Contract(
        constants.UNISWAP_V3_NFT_POSITION_MANAGER_ADDRESS,
        constants.UNISWAP_V3_NFT_POSITION_MANAGER_ABI,
        constants.MAINNET_PROVIDER
    );

    const total_positions = await contract.balanceOf(user_address);
    const calls = [];

    for (let i = 0; i < total_positions; i++) {
        calls.push(contract.tokenOfOwnerByIndex(user_address, i));
    }

    const position_ids = await Promise.all(calls);

    return position_ids.slice().reverse();
}

/**
 * Retrieves the relative values of two tokens in a liquidity pool based on their balances.
 * @param {string} pool_address - The address of the liquidity pool on Ethereum mainnet.
 * @param {string} token_0 - The address of the first token in the liquidity pool.
 * @param {string} token_1 - The address of the second token in the liquidity pool.
 * @returns {Promise<{ token_0_value: number, token_1_value: number }>} - A Promise that resolves to an object containing the relative values of the two tokens in the liquidity pool.
 */
async function get_token_values(pool_address, token_0, token_1) {
    const token_balances = await get_token_balances(
        pool_address,
        token_0,
        token_1
    );

    const token_0_balance = token_balances.token_0_balance;
    const token_1_balance = token_balances.token_1_balance;

    const token_0_value = token_1_balance / token_0_balance;
    const token_1_value = token_0_balance / token_1_balance;

    return {
        token_0_value: Number(token_0_value),
        token_1_value: Number(token_1_value),
    };
}

/**
 * Retrieves the symbols (ticker symbols) of two ERC-20 tokens based on their contract addresses.
 * @param {string} token_0 - The address of the first ERC-20 token contract on Ethereum mainnet.
 * @param {string} token_1 - The address of the second ERC-20 token contract on Ethereum mainnet.
 * @returns {Promise<{ token_0_symbol: string, token_1_symbol: string }>} - A Promise that resolves to an object containing the symbols of the two ERC-20 tokens.
 */
async function get_token_symbols(token_0, token_1) {
    const token_0_contract = new ethers.Contract(
        token_0,
        constants.PARTIAL_ERC_20_ABI,
        constants.MAINNET_PROVIDER
    );
    const token_1_contract = new ethers.Contract(
        token_1,
        constants.PARTIAL_ERC_20_ABI,
        constants.MAINNET_PROVIDER
    );

    const token_0_symbol = await token_0_contract.symbol();
    const token_1_symbol = await token_1_contract.symbol();

    return {
        token_0_symbol: token_0_symbol,
        token_1_symbol: token_1_symbol,
    };
}

/**
 * Retrieves the unclaimed token fees associated with a position for a user.
 * @param {number} position_id - The position id.
 * @param {string} user_address - The address of the user who owns the position on Ethereum mainnet.
 * @param {string} token_0 - The address of the first token in the liquidity pool associated with the position.
 * @param {string} token_1 - The address of the second token in the liquidity pool associated with the position.
 * @returns {Promise<{ token_0_fees: number, token_1_fees: number }>} - A Promise that resolves to an object containing the unclaimed token fees for the a position and user.
 */
async function get_unclaimed_token_fees(
    position_id,
    user_address,
    token_0,
    token_1
) {
    const contract = new ethers.Contract(
        constants.UNISWAP_V3_NFT_POSITION_MANAGER_ADDRESS,
        constants.UNISWAP_V3_NFT_POSITION_MANAGER_ABI,
        constants.MAINNET_PROVIDER
    );

    const encoded = {
        tokenId: position_id,
        recipient: user_address,
        amount0Max: constants.MAX_UINT128,
        amount1Max: constants.MAX_UINT128,
    };

    const tx = await contract.collect.staticCall(encoded);
    const token_0_decimals = await _get_token_decimals(token_0);
    const token_1_decimals = await _get_token_decimals(token_1);

    const token_0_fees = _format_units(tx[0], token_0_decimals);
    const token_1_fees = _format_units(tx[1], token_1_decimals);

    return {
        token_0_fees: Number(token_0_fees),
        token_1_fees: Number(token_1_fees),
    };
}

async function get_token_balances(pool_address, token_0, token_1) {
    const token_0_contract = new ethers.Contract(
        token_0,
        constants.PARTIAL_ERC_20_ABI,
        constants.MAINNET_PROVIDER
    );
    const token_1_contract = new ethers.Contract(
        token_1,
        constants.PARTIAL_ERC_20_ABI,
        constants.MAINNET_PROVIDER
    );

    const token_0_decimals = await _get_token_decimals(token_0);
    const token_1_decimals = await _get_token_decimals(token_1);

    const token_0_balance = _format_units(
        await token_0_contract.balanceOf(pool_address),
        token_0_decimals
    );
    const token_1_balance = _format_units(
        await token_1_contract.balanceOf(pool_address),
        token_1_decimals
    );

    return {
        token_0_balance: token_0_balance,
        token_1_balance: token_1_balance,
    };
}

/**
 * Adds a new liquidity pool to contract UniswapV3PoolAddresses on Sepolia testnet.
 * @param {string} pool_address - The address of the liquidity pool to be added.
 * @param {string} token_0 - The address of token 0 in the liquidity pool.
 * @param {string} token_1 - The address of token 1 in the liquidity pool.
 * @param {number} fee - The fee tier of the liquidity pool.
 * @param {number} lowest_block_number - The lowest block number to start tracking.
 * @throws {Error} Throws an error if the transaction execution fails or times out.
 */
async function batch_add_pool(
    pool_address,
    token_0,
    token_1,
    fee,
    lowest_block_number
) {
    const wallet = new ethers.Wallet(
        constants.WALLET_TESTNET_PRIVATE_KEY,
        constants.TESTNET_PROVIDER
    );
    const contract = new ethers.Contract(
        constants.UNISWAP_V3_POOL_ADDRESSES_ADDRESS,
        constants.UNISWAP_V3_POOL_ADDRESSES_ABI,
        wallet
    );
    const signer = wallet.connect(constants.TESTNET_PROVIDER);

    // Execute the function and wait until it's confirmed
    await _executeFunctionAndWait(
        contract,
        "batch_add_pool",
        [pool_address, token_0, token_1, fee, lowest_block_number],
        signer
    );
}

/**
 * Execute a function on a smart contract and wait for the transaction to be confirmed.
 * @param {ethers.Contract} contract - The ethers.js contract instance.
 * @param {string} functionName - The name of the function to execute on the contract.
 * @param {Array<any>} parameters - An array of parameters to pass to the function.
 * @param {ethers.Signer} signer - The signer object to connect and sign transactions.
 */
async function _executeFunctionAndWait(
    contract,
    functionName,
    parameters,
    signer
) {
    // Execute the function and get the transaction object
    const transaction = await contract
        .connect(signer)
        [functionName](...parameters);

    // Wait for the transaction to be confirmed and extract transaction hash
    await transaction
        .wait()
        .then((r) =>
            console.log(
                "Added new liquidity pool. Transaction hash on Sepolia: ",
                r.hash
            )
        );
}

/**
 * Format a fee value in raw units to a human-readable format.
 * @param {BigNumber | string} fee - The fee value to format.
 * @param {number} units - The number of decimal units to format the fee.
 * @returns {string} The formatted fee value as a string.
 */
function _format_units(fee, units) {
    return ethers.formatUnits(fee.toString(), units);
}

/**
 * Retrieve the number of decimal places associated with a token.
 * @param {string} token_address - The address of the token contract on Ethereum mainnet.
 * @returns {Promise<number>} The number of decimal places for the token.
 */
async function _get_token_decimals(token_address) {
    try {
        const token_contract = new ethers.Contract(
            token_address,
            constants.PARTIAL_ERC_20_ABI,
            constants.MAINNET_PROVIDER
        );

        const decimals = await token_contract.decimals();

        return Number(decimals);
    } catch (error) {
        console.error(
            `Error retrieving decimals for token ${token_address}: ${error.message}`
        );
        throw error;
    }
}

module.exports = {
    sleep,
    update_contract_address,
    create_json_file,
    get_contract_creation_block,
    get_last_finalised_block,
    get_last_processed_block,
    get_position,
    get_pool,
    get_position_ids,
    get_token_values,
    get_unclaimed_token_fees,
    get_token_balances,
    get_token_symbols,
    batch_add_pool,
};
