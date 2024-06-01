// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title UniswapV3LPAddresses
 * @dev This contract represents a list of Uniswap V3 liquidity pool contracts.
 *      It allows users to add and remove liquidity, as well as perform swaps.
 */
contract UniswapV3LPAddresses is AccessControl {
    // Struct to represent liquidity pool
    struct Liquidity_Pool {
        // The address of the first token
        address token0;
        // The address of the second token
        address token1;
        // The symbol of the first token
        string token0_symbol;
        // The symbol of the second token
        string token1_symbol;
        // The name of the first token
        string token0_name;
        // The name of the second token
        string token1_name;
    }

    // Mapping to store liquidity pools
    mapping(address => Liquidity_Pool[]) public liquidity_pools;

    // Create a new role identifier for the LP_MANAGER role
    bytes32 public constant LP_MANAGER_ROLE = keccak256("LP_MANAGER_ROLE");

    /**
     * @dev Adds new liquidity pool.
     * @param lp_address The address of the liquidity pool.
     * @param _token0 The address of the first token.
     * @param _token1 The address of the second token.
     * @param _token0_symbol The symbol of the first token.
     * @param _token1_symbol The symbol of the second token.
     * @param _token0_name The name of the first token.
     * @param _token1_name The name of the second token.
     */
    function add_liquidity_pool(
        address lp_address,
        address _token0,
        address _token1,
        string memory _token0_symbol,
        string memory _token1_symbol,
        string memory _token0_name,
        string memory _token1_name
    ) public onlyRole(LP_MANAGER_ROLE) {
        liquidity_pools[lp_address].push(
            Liquidity_Pool(_token0, _token1, _token0_symbol, _token1_symbol, _token0_name, _token1_name)
        );
    }

    /**
     * @dev Removes a liquidity pool.
     * @param lp_address The address of the liquidity pool.
     */
    function remove_liquidity_pool(
        address lp_address
    ) public onlyRole(LP_MANAGER_ROLE) {
        delete liquidity_pools[lp_address];
    }

    /**
     * @dev Gets the details of a liquidity pool.
     * @param lp_address The address of the liquidity pool.
     * @return The details of a liquidity pool.
     */
    function get_liquidity_pool(
        address lp_address
    ) public view returns (Liquidity_Pool[] memory) {
        return liquidity_pools[lp_address];
    }
}
