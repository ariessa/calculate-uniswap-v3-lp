const hre = require("hardhat");
const utils = require("../lib/utils");
const constants = require("../lib/constants");

async function main() {
    const last_block = await utils.get_contract_creation_block(
        constants.UNISWAP_V3_FACTORY_ADDRESS
    );
    const UniswapV3LPAddresses = await hre.ethers.getContractFactory(
        "UniswapV3LPAddresses"
    );
    const contract = await UniswapV3LPAddresses.deploy(last_block);

    // Update value in .env file
    utils.update_contract_address(
        "../.env",
        "UNISWAP_V3_POOL_ADDRESSES_ADDRESS=",
        `UNISWAP_V3_POOL_ADDRESSES_ADDRESS="${contract.target}"`
    );

    // Create abi file for contract UniswapV3PoolAddresses
    utils.create_json_file(
        "artifacts/contracts/UniswapV3LPAddresses.sol/UniswapV3LPAddresses.json",
        "UniswapV3LPAddresses.json",
        "abi/UniswapV3LPAddresses.json"
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
