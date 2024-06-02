const constant = require("./constants");
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
      fs.writeFileSync('contracts/UniswapV3LPAddresses.json', jsonString, 'utf8');
      console.log('File UniswapV3LPAddresses.json created successfully.');
  } catch (err) {
      console.error('Error:', err);
  }
}

async function get_contract_creation_block() {
    // Get contract creation details
    const response = await fetch(`${constant.ETHERSCAN_MAINNET_URL}?module=contract&action=getcontractcreation&contractaddresses=${constant.UNISWAP_V3_FACTORY_ADDRESS}&apikey=${constant.ETHERSCAN_API_KEY}`);
    const data = await response.json();
    const tx_hash = await data.result[0].txHash;

    // Get the transaction receipt for the transaction hash
    const receipt = await constant.mainnet_provider.getTransactionReceipt(tx_hash);

    if (!receipt) {
        console.log("Transaction receipt not found.");
        return;
    }

    return receipt.blockNumber;
}

async function get_last_finalised_block() {
    // Get the latest finalized block number on mainnet
    const latestFinalizedBlockNumber = await constant.mainnet_provider.getBlockNumber();

    // Minus by 10 to ensure that the block is finalised
    return latestFinalizedBlockNumber - 10;
}

async function get_last_processed_block() {
    // Get the latest processed block from deployed contract on sepolia
    const contractAbi = [
        {
            "inputs": [],
            "name": "get_last_block",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
    ];

    // Load the contract interface
    const contract = new ethers.Contract(constant.CONTRACT_ADDRESS, contractAbi, testnet_provider);

    // Call the contract function to read the value
    const value = parseInt((await contract.get_last_block()).toString());

    return value;
}

async function add_liquidity_pool(lp_address, token_a, token_b, fee, block_number) {
    // Load the contract ABI and address
    const contractAbi = [
        {
            "inputs": [
              {
                "internalType": "address",
                "name": "lp_address",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "token_a",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "token_b",
                "type": "address"
              },
              {
                "internalType": "uint24",
                "name": "fee",
                "type": "uint24"
              },
              {
                "internalType": "uint256",
                "name": "block_number",
                "type": "uint256"
              }
            ],
            "name": "add_liquidity_pool",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
    ];

    const wallet = new ethers.Wallet(constant.WALLET_TESTNET_PRIVATE_KEY, testnet_provider);
    const contract = new ethers.Contract(constant.CONTRACT_ADDRESS, contractAbi, wallet);
    const signer = wallet.connect(testnet_provider);

    // Execute the function and wait until it's confirmed
    await _executeFunctionAndWait(contract, "add_liquidity_pool", [lp_address, token_a, token_b, fee, block_number], signer);
}

async function batch_add_liquidity_pool(lp_address, token_a, token_b, fee, lowest_block_number) {
    // Load the contract ABI and address
    const contractAbi = [
      {
        "inputs": [
          {
            "internalType": "address[]",
            "name": "lp_address",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "token_a",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "token_b",
            "type": "address[]"
          },
          {
            "internalType": "uint24[]",
            "name": "fee",
            "type": "uint24[]"
          },
          {
            "internalType": "uint256",
            "name": "block_number",
            "type": "uint256"
          }
        ],
        "name": "batch_add_liquidity_pool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    const wallet = new ethers.Wallet(constant.WALLET_TESTNET_PRIVATE_KEY, testnet_provider);
    const contract = new ethers.Contract(constant.CONTRACT_ADDRESS, contractAbi, wallet);
    const signer = wallet.connect(testnet_provider);

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
    add_liquidity_pool,
    batch_add_liquidity_pool,
};
