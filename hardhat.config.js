require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
    networks: {
        sepolia: {
            url: `${process.env.INFURA_TESTNET_URL}${process.env.INFURA_API_KEY}`,
            accounts: [`0x${process.env.WALLET_TESTNET_PRIVATE_KEY}`],
        },
    },
};
