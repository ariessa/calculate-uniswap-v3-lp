// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title UniswapV3PoolAddresses
 * @dev This contract represents a list of Uniswap V3 liquidity pool contracts that were deployed on Ethereum mainnet.
 *      It allows users to add and remove liquidity pool, as well as get the details of a liquidity pool.
 */
contract UniswapV3PoolAddresses is AccessControl {
    /** Struct to represent a liquidity pool */
    struct Pool {
        /** The id of the liquidity pool in Ethereum mainnet*/
        uint80 pool_id;
        /** The address of the first token in Ethereum mainnet */
        address token_0;
        /** The address of the second token in Ethereum mainnet */
        address token_1;
        /** The fee of the liquidity pool in Ethereum mainnet */
        uint24 fee;
        /** The flag to indicate whether the liquidity pool exists or not in Ethereum mainnet */
        bool exist;
    }

    /** Mapping to store liquidity pools */
    mapping(address => Pool) private pools;

    /** Last processed block in Ethereum mainnet with status finalized */
    uint256 private last_block;

    /** Role identifier for the LP_MANAGER role */
    bytes32 public constant LP_MANAGER_ROLE = keccak256("LP_MANAGER_ROLE");

    /**
     * @notice Emitted when a liquidity pool is added.
     * @param pool_id The id of the liquidity pool in Ethereum mainnet.
     * @param pool_address The address of the liquidity pool in Ethereum mainnet.
     * @param token_0 The first token address of the pool by address sort order in Ethereum mainnet.
     * @param token_1 The second token address of the pool by address sort order in Ethereum mainnet.
     * @param fee The fee collected upon every swap in the pool in Ethereum mainnet, denominated in hundredths of a bip.
     */
    event PoolAdded(
        uint80 pool_id,
        address pool_address,
        address indexed token_0,
        address indexed token_1,
        uint24 indexed fee
    );

    /**
     * @dev Constructor function.
     * @param _last_block The last processed block in Ethereum mainnet with status finalized.
     */
    constructor(uint256 _last_block) {
        last_block = _last_block;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(LP_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Adds multiple liquidity pools.
     * @param pool_id The ids of the liquidity pool in Ethereum mainnet.
     * @param pool_address The addresses of the liquidity pool in Ethereum mainnet.
     * @param token_a The addresses of the first token in Ethereum mainnet.
     * @param token_b The addresses of the second token in Ethereum mainnet.
     * @param fee The fee of liquidity pools in Ethereum mainnet, denominated in hundredths of a bip (1e-6).
     * @param block_number The lowest block number from a batch of liquidity pools' event logs.
     */
    function batch_add_pool(
        uint80[] memory pool_id,
        address[] memory pool_address,
        address[] memory token_a,
        address[] memory token_b,
        uint24[] memory fee,
        uint256 block_number
    ) public onlyRole(LP_MANAGER_ROLE) {
        require(
            pool_id.length == pool_address.length &&
                pool_id.length == token_a.length &&
                pool_id.length == token_b.length &&
                pool_id.length == fee.length,
            "Array lengths mismatch!"
        );

        for (uint256 i = 0; i < pool_id.length; i++) {
            if (token_a[i] != token_b[i]) {
                (address token_0, address token_1) = token_a[i] < token_b[i]
                    ? (token_a[i], token_b[i])
                    : (token_b[i], token_a[i]);
                if (
                    token_0 != address(0) &&
                    pools[pool_address[i]].exist == false
                ) {
                    pools[pool_address[i]] = Pool(
                        pool_id[i],
                        token_0,
                        token_1,
                        fee[i],
                        true
                    );
                    emit PoolAdded(
                        pool_id[i],
                        pool_address[i],
                        token_0,
                        token_1,
                        fee[i]
                    );
                }
            }
        }

        _set_last_block(block_number);
    }

    /**
     * @dev Gets the details of a liquidity pool in Ethereum mainnet.
     * @param pool_address The address of the liquidity pool in Ethereum mainnet.
     * @return Liquidity_Pool The details of a liquidity pool in Ethereum mainnet.
     */
    function get_pool(address pool_address) public view returns (Pool memory) {
        require(
            pools[pool_address].exist == true,
            "Liquidity pool does not exist in Ethereum mainnet!"
        );
        return pools[pool_address];
    }

    /**
     * @dev Gets the value of last processed block in Ethereum mainnet with status finalized.
     * @return uint256 The value of last processed block in Ethereum mainnet with status finalized.
     */
    function get_last_block() public view returns (uint256) {
        return last_block;
    }

    /**
     * @dev Sets the value of last processed block in Ethereum mainnet with status finalized.
     * @param block_number The new block number in in Ethereum mainnet with status finalized.
     */
    function _set_last_block(
        uint256 block_number
    ) internal onlyRole(LP_MANAGER_ROLE) {
        require(block_number != 0, "New block number cannot be zero!");
        require(
            block_number > last_block,
            "New block number must be bigger than the old block number!"
        );
        last_block = block_number;
    }
}
