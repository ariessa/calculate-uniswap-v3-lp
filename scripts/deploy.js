const hre = require("hardhat");
const { update_contract_address, create_abi, get_contract_creation_block} = require("../lib/utils");

async function main() {
    const last_block = await get_contract_creation_block();
    const UniswapV3LPAddresses = await hre.ethers.getContractFactory("UniswapV3LPAddresses");
    const contract = await UniswapV3LPAddresses.deploy(last_block);

    // Update value in .env file
    update_contract_address('CONTRACT_ADDRESS=', `CONTRACT_ADDRESS="${contract.target}"`);

    // Create abi file for contract UniswapV3LPAddresses
    create_abi();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
