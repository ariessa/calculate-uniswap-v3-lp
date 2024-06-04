<h1>🦄 Calculate Uniswap V3 LP</h1>

<p>Pull and calculate the value of liquidity provider (LP) tokens in Uniswap V3.</p>

<br />

> "Just as unicorns are legendary beings, so too is flawless code." - Unknown

<br />

##### Table of Contents  
- [How to use this repo](#how-to-use-this-repo)  
    - [How to set up contract UniswapV3PoolAddresses on Sepolia testnet](#how-to-set-up-contract-uniswapv3pooladdresses-on-sepolia-testnet)
    - [How to run the tests](#how-to-run-the-tests)
- [How things work under the hood](#how-things-work-under-the-hood)
    - [API endpoint](#api-endpoint)
    - [Smart contract](#smart-contract)

<br />

---

<a name="#how-to-use-this-repo"/>

## How to use this repo

1. Clone this repository and `cd` into the local directory.

2. Use the Node.js version specified in `.nvmrc`.

    ```
    nvm use
    ```

2. Install all dependencies.

    ```
    npm install
    ```

3. Get a list of available commands.

    ```
    npm run
    ```

<br />

<a name="#how-to-set-up-contract-uniswapv3pooladdresses-on-sepolia-testnet"/>

### How to set up contract `UniswapV3PoolAddresses` on Sepolia testnet

1. Compile and deploy the contract on Sepolia testnet.

    ```
    npm run deploy
    ```

2. Populate data from contract `UniswapV3Factory` on Ethereum mainnet into contract `UniswapV3PoolAddresses` on Sepolia testnet.

    ```
    npm run populate
    ```

<br />

<a name="#how-to-run-the-tests"/>

### How to run the tests

- Get a list of unit tests and their verbose results

    ```
    npm run test
    ```

    <img src="/screenshots/test.png"/>

    <br />

- Get test coverage

    ```
    npm run test-coverage
    ```

   <img src="/screenshots/test-coverage.png"/>

<br />

<a name="#how-things-work-under-the-hood"/>

## How things work under the hood

<img src="/screenshots/how-things-work-under-the-hood.png"/>

1. Deploy contract `UniswapV3PoolAddresses.sol` on Ethereum Sepolia testnet.

2. Query and filter logs by `event PoolCreated` from contract `UniswapV3Factory.sol` on Ethereum mainnet.

    Every time a liquidity pool is created, the contract `UniswapV3Factory.sol` will emit an event called PoolCreated.

    - Text signature
        PoolCreated(address,address,uint24,int24,address)

    - Hex signature
        0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118

3. Add pool data from `event PoolCreated` into contract `UniswapV3PoolAddresses.sol` on Ethereum Sepolia testnet.

4. Send POST request to API endpoint `/api/calculate_lp` with `pool_address` and `user_address` as request body.

    Sample of request body
    ```
    {
        "pool_address": "0x7b1E5D984A43eE732de195628d20d05CFaBc3cC7",
        "user_address": "0xe403043A0F9C7B9F315Cf145166EB747D9790E77"
    }
    ```

5. The API endpoint executes function `calculate_lp`.

6. Function `is_pool_address_valid` validates pool address using function `get_pool` from contract `UniswapV3PoolAddresses.sol` on Ethereum Sepolia testnet.

7. Function `get_pool` gets pool details such as addresses of `token_0` and `token_1` as well as `fee_tier` using function `get_pool` from contract `UniswapV3PoolAddresses.sol` on Ethereum Sepolia testnet.

8. Function `get_token_symbols` gets the symbol of `token_0` and `token_1` using function `symbols` from their respective ERC-20 token contracts on Ethereum mainnet.

9. Function `get_token_values` gets the values of `token_0` and `token_1` using function `balanceOf` from their respective ERC-20 token contracts on Ethereum mainnet.

    > Not too sure about the maths part 😮‍💨

10. Function `get_position_ids` gets a list of position ids for an address, sort in descending order. Position id is basically the token_id for the `Uniswap V3: Positions NFT`.

    Every time an address creates a new position, the address will get a `Uniswap V3: Positions NFT` that contains the details of their position. Same goes to updating a position.

11. Function `get_position` finds a position that matches the `token_0`, `token_1`, and `fee_tier`.

    Since multiple position ids with matching criteria can exists, only the first match will be considered.

12. Function `get_unclaimed_token_fees` gets the unclaimed fees of both `token_0` and `token_1` by simulating a blockchain transaction using the Contract's method `staticCall` from `ethers v6`.

    > The coding part was easy, but maths aint mathing 😶‍🌫️

13. Function `calculate_lp` returns an object.

    Sample of object

    ```
    {
        "token_0": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "token_1": "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3",
        "token_0_symbol": "WETH",
        "token_1_symbol": "ONDO",
        "token_0_value": 1292.160650727253,
        "token_1_value": 0.0007738975795596165,
        "token_0_fees": "0.000000000004256506",
        "token_1_fees": "0.660920508328780757",
        "fee_tier": 3000,
        "nft_id": 734999,
        "min_tick": 74340,
        "max_tick": 82020
    }
    ```
14. The API endpoints responds back with the object from function `calculate_lp`.

<br />

<a name="#api-endpoint"/>

### API endpoint

/api/calculate_lp

Sample of sending POST request with a request body using `cURL`

```
curl --location 'http://localhost:4000/api/calculate_lp' \
--header 'Content-Type: application/json' \
--data '{
    "pool_address": "0xPoolAddress",
    "user_address": "0xUserAddress"
}'
```

<br />

<a name="#smart-contract"/>

### Smart contract

Contract `UniswapV3PoolAddresses` was created using `UniswapV3Pool` and `UniswapV3Factory`. Initially, it was named `UniswapV3LPAddresses`, so the deployed contract name on Sepolia testnet retains the old name. 

- It represents a list of Uniswap V3 liquidity pool contracts that were deployed on Ethereum mainnet.
- It allows users to add and remove liquidity pool, as well as get the details of a liquidity pool.

Deployed contract address on Sepolia testnet
```
0xF54bEdec922CF0d7E89C6F9946147f7B8Cf0c4e6
```
