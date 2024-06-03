const constants = require("../../lib/constants");
const utils = require("../../lib/utils");
const fs = require("fs");

describe("function sleep", () => {
    test("it resolves after the specified time", async () => {
        const startTime = Date.now();
        const delay = 1000;
        await utils.sleep(delay);
        const endTime = Date.now();
        expect(endTime - startTime).toBeGreaterThanOrEqual(delay);
    });

    test("it resolves immediately for zero milliseconds", async () => {
        const start = Date.now();
        await utils.sleep(0);
        const end = Date.now();
        expect(end - start).toBeLessThan(10);
    });
});

describe("function update_contract_address", () => {
    const pattern = "UNISWAP_V3_POOL_ADDRESSES_ADDRESS=";
    const new_value = `UNISWAP_V3_POOL_ADDRESSES_ADDRESS="0x00"`;
    const file_path = ".env.test";
    let original_console_log;
    let log_spy;

    beforeEach(() => {
        // Store the original console.log
        original_console_log = console.log;

        // Replace console.log with a mock function
        log_spy = jest.spyOn(console, "log");

        if (fs.existsSync(file_path)) {
            fs.unlinkSync(file_path);
        }
    });

    afterEach(() => {
        console.log = original_console_log;
    });

    test("it updates contract address in a file if the file exists", async () => {
        const file_content = `UNISWAP_V3_POOL_ADDRESSES_ADDRESS=""`;

        // Write the content to the file
        fs.writeFileSync(file_path, file_content);

        utils.update_contract_address(file_path, pattern, new_value);

        expect(log_spy).toHaveBeenCalledWith("Line updated successfully.");
    });

    test("it throws an error if the file does not exist", async () => {
        expect(() =>
            utils.update_contract_address(file_path, pattern, new_value)
        ).toThrow(`Error: ENOENT: no such file or directory, open '.env.test'`);
    });
});

describe("function get_contract_creation_block", () => {
    test("it can get the contract creation block of a contract address", async () => {
        expect(
            await utils.get_contract_creation_block(
                constants.UNISWAP_V3_NFT_POSITION_MANAGER_ADDRESS
            )
        ).toEqual(12369651);
    });

    test("it should throw error if the given address is not a contract address", async () => {
        await expect(
            utils.get_contract_creation_block(
                "0xf9B1A54dd6D4ef0ade7feb45fD29344d2D01D3a2"
            )
        ).rejects.toThrow(TypeError);
    });
});

describe("function get_pool", () => {
    test("it can get details of an existing Uniswap V3 Pool", async () => {
        expect(
            await utils.get_pool("0x7b1E5D984A43eE732de195628d20d05CFaBc3cC7")
        ).toEqual({
            token_0: expect.any(String),
            token_1: expect.any(String),
            fee_tier: expect.any(BigInt),
        });

        expect(
            await utils.get_pool("0x7b1E5D984A43eE732de195628d20d05CFaBc3cC7")
        ).toEqual({
            token_0: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            token_1: "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3",
            fee_tier: 3000n,
        });
    });

    test("it should revert if pool address is not a Uniswap V3 Pool", async () => {
        await expect(
            utils.get_pool("0xe403043A0F9C7B9F315Cf145166EB747D9790E77")
        ).rejects.toThrowError("Liquidity pool does not exist!");
    });
});

describe("function get_position", () => {
    test("it can get the position details given a valid position id", async () => {
        expect(
            await utils.get_position(
                [734999n, 734427n, 664870n, 654853n, 619539n],
                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3",
                3000
            )
        ).toEqual({
            position_id: expect.any(Number),
            min_tick: expect.any(Number),
            max_tick: expect.any(Number),
        });

        expect(
            await utils.get_position(
                [734999n, 734427n, 664870n, 654853n, 619539n],
                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3",
                3000
            )
        ).toEqual({
            position_id: 734999,
            min_tick: 74340,
            max_tick: 82020,
        });
    });

    test("it throws an error when it cannot find a position with matching token addresses and fee tier", async () => {
        await expect(
            utils.get_position(
                [39n],
                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3",
                3000
            )
        ).rejects.toThrow("Cannot read properties of undefined (reading 'id')");
    });
});

describe("function get_position_ids", () => {
    test("it can get the position ids of an address", async () => {
        expect(
            await utils.get_position_ids(
                "0xe403043a0f9c7b9f315cf145166eb747d9790e77"
            )
        ).toEqual(expect.any(Array));

        expect(
            await utils.get_position_ids(
                "0xe403043a0f9c7b9f315cf145166eb747d9790e77"
            )
        ).toEqual(expect.arrayContaining([expect.any(BigInt)]));

        expect(
            await utils.get_position_ids(
                "0xe403043a0f9c7b9f315cf145166eb747d9790e77"
            )
        ).toEqual(
            expect.arrayContaining([
                734999n,
                734427n,
                664870n,
                654853n,
                619539n,
            ])
        );
    });

    test("it returns an empty array when it cannot get any position ids of an address", async () => {
        expect(
            await utils.get_position_ids(
                "0x7b1E5D984A43eE732de195628d20d05CFaBc3cC7"
            )
        ).toEqual([]);
    });
});

describe("function get_token_values", () => {
    test("it can get the token values of a Uniswap V3 pool", async () => {
        expect(
            await utils.get_token_values(
                "0x7b1E5D984A43eE732de195628d20d05CFaBc3cC7",
                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3"
            )
        ).toEqual({
            token_0_value: expect.any(Number),
            token_1_value: expect.any(Number),
        });
    });
});

describe("function get_token_symbols", () => {
    test("it can get the symbols of the tokens in a Uniswap V3 pool", async () => {
        expect(
            await utils.get_token_symbols(
                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3"
            )
        ).toEqual({
            token_0_symbol: expect.any(String),
            token_1_symbol: expect.any(String),
        });

        expect(
            await utils.get_token_symbols(
                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3"
            )
        ).toEqual({
            token_0_symbol: "WETH",
            token_1_symbol: "ONDO",
        });
    });
});

describe("function get_unclaimed_token_fees", () => {
    test("it can get the unclaimed token fees of a Uniswap V3 pool", async () => {
        expect(
            await utils.get_unclaimed_token_fees(
                4,
                "0xe403043A0F9C7B9F315Cf145166EB747D9790E77",
                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3"
            )
        ).toEqual({
            token_0_fees: expect.any(Number),
            token_1_fees: expect.any(Number),
        });
    });
});
