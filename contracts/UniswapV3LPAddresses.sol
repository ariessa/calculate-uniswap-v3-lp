// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title UniswapV3LPAddresses
 * @dev This contract represents a list of Uniswap V3 liquidity pool contracts.
 *      It allows users to add and remove liquidity pool, as well as get the details of a liquidity pool.
 */
contract UniswapV3LPAddresses is AccessControl {
    /** Struct to represent liquidity pool */ 
    struct Liquidity_Pool {
        /** The address of the first token */
        address token_0;
        /** The address of the second token */
        address token_1;
        /** The fee of the liquidity pool */
        uint24 fee;
        /** The flag to indicate whether the liquidity pool exists or not */
        bool exist;
    }

    /** Mapping to store liquidity pools */
    mapping(address => Liquidity_Pool) public liquidity_pools;

    /** Addresses of liquidity pools */
    address[] private liquidity_pool_addresses;

    /** Last processed block in mainnet with status finalized */
    uint256 private last_block;

    /** Role identifier for the LP_MANAGER role */
    bytes32 public constant LP_MANAGER_ROLE = keccak256("LP_MANAGER_ROLE");

    /**
     * @notice Emitted when a pool is added.
     * @param token_0 The first token of the pool by address sort order.
     * @param token_1 The second token of the pool by address sort order.
     * @param fee The fee collected upon every swap in the pool, denominated in hundredths of a bip.
     * @param pool The address of the added pool.
     */ 
    event PoolAdded(
        address indexed token_0,
        address indexed token_1,
        uint24 indexed fee,
        address pool
    );

    /** 
     * @dev Constructor function.
     * @param _last_block The last processed block in mainnet with status finalized.
     */
    constructor(uint256 _last_block) {
        last_block = _last_block;
        _grantRole(LP_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Adds new liquidity pool.
     * @param lp_address The address of the liquidity pool.
     * @param token_a The address of the first token.
     * @param token_b The address of the second token.
     * @param fee The fee of the liquidity pool, denominated in hundredths of a bip (1e-6).
     * @param block_number The block number on mainnet when liquidity pool is created.
     */
    function add_liquidity_pool(
        address lp_address,
        address token_a,
        address token_b,
        uint24 fee,
        uint256 block_number
    ) public onlyRole(LP_MANAGER_ROLE) {
        require(token_a != token_b, "Token addresses are the same!");
        (address token_0, address token_1) = token_a < token_b ? (token_a, token_b) : (token_b, token_a);
        require(token_0 != address(0), "First token address is a zero or null address!");
        require(liquidity_pools[lp_address].exist == false, "Liquidity pool already exists!");
        liquidity_pools[lp_address] = Liquidity_Pool(token_0, token_1, fee, true);
        liquidity_pool_addresses.push(lp_address);
        _set_last_block(block_number);
        emit PoolAdded(token_0, token_1, fee, lp_address);
    }

    /**
     * @dev Adds multiple liquidity pools.
     * @param lp_address The addresses of the liquidity pool.
     * @param token_a The addresses of the first token.
     * @param token_b The addresses of the second token.
     * @param fee The fee of liquidity pools, denominated in hundredths of a bip (1e-6).
     * @param block_number The lowest block number from a batch of liquidity pools' event logs.
     */
    function batch_add_liquidity_pool(
        address[] memory lp_address,
        address[] memory token_a,
        address[] memory token_b,
        uint24[] memory fee,
        uint256 block_number
    ) public onlyRole(LP_MANAGER_ROLE) {
        require(
            lp_address.length == token_a.length &&
            lp_address.length == token_b.length &&
            lp_address.length == fee.length,
            "Array lengths mismatch!"
        );

        for (uint256 i = 0; i < lp_address.length; i++) {
            if(token_a[i] != token_b[i]) {
                    (address token_0, address token_1) = token_a[i] < token_b[i] ? (token_a[i], token_b[i]) : (token_b[i], token_a[i]);
                    if (token_0 != address(0) && liquidity_pools[lp_address[i]].exist == false) {
                        liquidity_pools[lp_address[i]] = Liquidity_Pool(token_0, token_1, fee[i], true);
                        liquidity_pool_addresses.push(lp_address[i]);
                        _set_last_block(block_number);
                        emit PoolAdded(token_0, token_1, fee[i], lp_address[i]);
                    }
            }
        }
    }

    /**
     * @dev Gets the details of a liquidity pool.
     * @param lp_address The address of the liquidity pool.
     * @return Liquidity_Pool The details of a liquidity pool.
     */
    function get_liquidity_pool(
        address lp_address
    ) public view returns (Liquidity_Pool memory) {
        require(liquidity_pools[lp_address].exist == true, "Liquidity pool does not exist!");
        return liquidity_pools[lp_address];
    }

    /**
     * @dev Sets the value of last processed block in mainnet with status finalized.
     * @param block_number The new block number in mainnet with status finalized.
     */
    function _set_last_block(uint256 block_number) internal onlyRole(LP_MANAGER_ROLE) {
        require(block_number != 0, "New block number cannot be zero!");
        require(block_number > last_block, "New block number must be bigger than the old block number!");
        last_block = block_number;
    }

    /**
     * @dev Gets the value of last processed block in mainnet with status finalized.
     * @return uint256 The value of last processed block in mainnet with status finalized.
     */
    function get_last_block() public view returns (uint256) {
        return last_block;
    }

    /**
     * @dev Gets the value of last processed block in mainnet with status finalized.
     * @return address[] The addresses of liquidity pools.
     */
    function get_liquidity_pool_addresses() public view returns (address[] memory) {
        return liquidity_pool_addresses;
    }
}
