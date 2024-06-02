const constants = require("./constants");
const { ethers } = require("ethers");
const fs = require('fs');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function update_contract_address(pattern, newValue) {
    try {
        // Read the content of the .env file synchronously
        let data = fs.readFileSync('.env', 'utf8');

        // Split the content into lines
        const lines = data.split('\n');

        // Find the line that matches the pattern
        const index = lines.findIndex(line => line.includes(pattern));

        if (index !== -1) {
            // Update the line with the new value
            lines[index] = newValue;
            const updatedContent = lines.join('\n');

            // Write the updated content back to the .env file synchronously
            fs.writeFileSync('.env', updatedContent, 'utf8');
            console.log('Line updated successfully.');
        } else {
            console.log('No matching line found in .env file.');
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

function create_abi() {
  // Read the input JSON file synchronously
  try {
      const data = fs.readFileSync('artifacts/contracts/UniswapV3LPAddresses.sol/UniswapV3LPAddresses.json', 'utf8');
  
      // Parse the JSON data
      const jsonData = JSON.parse(data);
  
      // Extract the desired values from the JSON data
      const extractedValues = jsonData.abi;
  
      // Convert the extracted values to JSON string
      const jsonString = JSON.stringify(extractedValues, null, 2);
  
      // Write the JSON string to a new JSON file synchronously
      fs.writeFileSync('abi/UniswapV3LPAddresses.json', jsonString, 'utf8');
      console.log('File UniswapV3LPAddresses.json created successfully.');
  } catch (err) {
      console.error('Error:', err);
  }
}

async function get_contract_creation_block() {
    // Get contract creation details
    const response = await fetch(`${constants.ETHERSCAN_MAINNET_URL}?module=contract&action=getcontractcreation&contractaddresses=${constants.UNISWAP_V3_FACTORY_ADDRESS}&apikey=${constants.ETHERSCAN_API_KEY}`);
    const data = await response.json();
    const tx_hash = await data.result[0].txHash;

    // Get the transaction receipt for the transaction hash
    const receipt = await constants.MAINNET_PROVIDER.getTransactionReceipt(tx_hash);

    if (!receipt) {
        console.log("Transaction receipt not found.");
        return;
    }

    return receipt.blockNumber;
}

async function get_last_finalised_block() {
    const latestFinalizedBlockNumber = await constants.MAINNET_PROVIDER.getBlockNumber();

    return latestFinalizedBlockNumber - 10;
}

async function get_last_processed_block() {
  const contract = new ethers.Contract(constants.UNISWAP_V3_LP_ADDRESSES_ADDRESS, constants.UNISWAP_V3_LP_ADDRESSES_ABI, constants.TESTNET_PROVIDER);
  const value = parseInt((await contract.get_last_block()).toString());

  return value;
}

async function get_liquidity_pool(address) {
  const contract = new ethers.Contract(constants.UNISWAP_V3_LP_ADDRESSES_ADDRESS, constants.UNISWAP_V3_LP_ADDRESSES_ABI, constants.TESTNET_PROVIDER);
  const value = await contract.get_liquidity_pool(address);

  return {
    token_0: value[0],
    token_1: value[1]
  };
}

async function get_total_lp(lp_address, user_address) {
  const contract = new ethers.Contract(lp_address, constants.UNISWAP_V3_POOL_ABI, constants.MAINNET_PROVIDER);
  const totalSupply = await contract.totalSupply();
  const userBalance = await contract.balanceOf(user_address);

  return {
    total_lp_supply: await totalSupply,
    total_lp_balance: await userBalance,
  };
}

async function get_token_values(lp_address) {
  const contract = new ethers.Contract(lp_address, constants.UNISWAP_V3_POOL_ABI, constants.MAINNET_PROVIDER);

  const total_lp_supply = await contract.totalSupply();
  const total_lp_balance = await contract.balanceOf(user_address);

  return {
    total_lp_supply: await total_lp_supply,
    total_lp_balance: await total_lp_balance,
  };
}

async function add_liquidity_pool(lp_address, token_a, token_b, fee, block_number) {
    const wallet = new ethers.Wallet(constants.WALLET_TESTNET_PRIVATE_KEY, constants.TESTNET_PROVIDER);
    const contract = new ethers.Contract(constants.UNISWAP_V3_LP_ADDRESSES_ADDRESS, constants.UNISWAP_V3_LP_ADDRESSES_ABI, wallet);
    const signer = wallet.connect(constants.TESTNET_PROVIDER);

    await _executeFunctionAndWait(contract, "add_liquidity_pool", [lp_address, token_a, token_b, fee, block_number], signer);
}

async function batch_add_liquidity_pool(lp_address, token_a, token_b, fee, lowest_block_number) {
  const wallet = new ethers.Wallet(constants.WALLET_TESTNET_PRIVATE_KEY, constants.TESTNET_PROVIDER);
  const contract = new ethers.Contract(constants.UNISWAP_V3_LP_ADDRESSES_ADDRESS, constants.UNISWAP_V3_LP_ADDRESSES_ABI, wallet);
  const signer = wallet.connect(constants.TESTNET_PROVIDER);

  // Execute the function and wait until it's confirmed
  await _executeFunctionAndWait(contract, "batch_add_liquidity_pool", [lp_address, token_a, token_b, fee, lowest_block_number], signer);
}

async function _executeFunctionAndWait(contract, functionName, parameters, signer) {
    // Execute the function and get the transaction object
    const transaction = await contract.connect(signer)[functionName](...parameters);

    // Wait for the transaction to be confirmed and extract transaction hash
    await transaction.wait().then(r => console.log("Added new liquidity pool. Transaction hash on Sepolia: ", r.hash));
}

module.exports = { 
    sleep,
    update_contract_address,
    create_abi,
    get_contract_creation_block,
    get_last_finalised_block,
    get_last_processed_block,
    get_liquidity_pool,
    get_total_lp,
    get_token_values,
    add_liquidity_pool,
    batch_add_liquidity_pool,
};
