// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

contract UniswapV3LPAddresses is AccessControl {
    struct Liquidity_Pool {
        string token0_name;
        string token1_name;
        address token0;
        address token1;
    }

    mapping(address => Liquidity_Pool[]) public liquidity_pools;

    // Create a new role identifier for the LP_MANAGER role
    bytes32 public constant LP_MANAGER_ROLE = keccak256("LP_MANAGER_ROLE");

    // Add new liquidity pool
    function add_lp(address lp_address, string memory _token0_name, string memory _token_1_name, address _token0, address _token1) public onlyRole(LP_MANAGER_ROLE) {
        liquidity_pools[lp_address].push(Liquidity_Pool(_token0_name, _token_1_name, _token0, _token1));
    }

    // Delete a liquidity pool based on address
    function remove_lp(address lp_address) public onlyRole(LP_MANAGER_ROLE) {
        delete liquidity_pools[lp_address];
    }

    // Get details of a liquidity pool based on address
    function get_liquidity_pool_details(address lp_address) public view returns (Liquidity_Pool[] memory) {
        return liquidity_pools[lp_address];
    }
}
