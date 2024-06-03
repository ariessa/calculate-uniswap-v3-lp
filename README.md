<h1>Calculate Uniswap V3 LP 🦄</h1>

<p>Pull and calculate the value of liquidity provider (LP) tokens in Uniswap V3.</p>

<br />

> "Just as unicorns are legendary beings, so too is flawless code." - Unknown

<br />

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

### How to run the tests

- Get a list of unit tests and their verbose results

    ```
    npm run test
    ```

    <!-- TODO: <img src="/screenshots/test.png"/> -->

    <br />

- Get test coverage

    ```
    npm run test-coverage
    ```

   <!-- TODO: <img src="/screenshots/test-coverage.png"/> -->
