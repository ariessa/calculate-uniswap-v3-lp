const validations = require("../../lib/validations");

describe("function is_address_valid", () => {
    test("it returns true if an address is valid", async () => {
        expect(
            validations.is_address_valid(
                "0xe403043A0F9C7B9F315Cf145166EB747D9790E77",
                "user"
            )
        ).toBe(true);
    });

    test("it throws an error if an address is invalid", async () => {
        expect(() => validations.is_address_valid("0xinvalid", "user")).toThrow(
            "Invalid address for user!"
        );
    });
});

describe("function is_pool_address_valid", () => {
    test("it returns true if an address is a valid Uniswap V3 pool address", async () => {
        expect(
            await validations.is_pool_address_valid(
                "0x7b1E5D984A43eE732de195628d20d05CFaBc3cC7"
            )
        ).toBe(true);
    });

    test("it throws an error if an address is an invalid Uniswap V3 pool address", async () => {
        await expect(
            validations.is_pool_address_valid("0xinvalid")
        ).resolves.toBe(false);
    });
});
