const validations = require("../../lib/validations");
const utils = require("../../lib/utils");
const pools = require("../../lib/pools");

jest.setTimeout(10000);

jest.mock("../../lib/validations");
jest.mock("../../lib/utils");

describe("calculate_lp", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should return correct LP details for valid inputs", async () => {
        const pool_address = "0x7b1E5D984A43eE732de195628d20d05CFaBc3cC7";
        const user_address = "0xe403043A0F9C7B9F315Cf145166EB747D9790E77";
        const token_0 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
        const token_1 = "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3";
        const fee_tier = 3000;
        const token_0_symbol = "WETH";
        const token_1_symbol = "ONDO";

        validations.is_address_valid.mockReturnValue(true);
        validations.is_pool_address_valid.mockResolvedValue(true);

        const mock_pool_details = {
            token_0: token_0,
            token_1: token_1,
            fee_tier: fee_tier,
        };
        utils.get_pool.mockResolvedValue(mock_pool_details);

        const mock_token_symbols = {
            token_0_symbol: token_0_symbol,
            token_1_symbol: token_1_symbol,
        };
        utils.get_token_symbols.mockResolvedValue(mock_token_symbols);

        const mock_token_values = {
            token_0_value: 9999,
            token_1_value: 111,
        };
        utils.get_token_values.mockResolvedValue(mock_token_values);

        const mock_position_ids = [1, 2, 3];
        utils.get_position_ids.mockResolvedValue(mock_position_ids);

        const mock_position = {
            id: 1,
            position_id: 123,
            min_tick: -100,
            max_tick: 100,
        };
        utils.get_position.mockResolvedValue(mock_position);

        const mock_unclaimed_token_fees = {
            token_0_fees: 10,
            token_1_fees: 20,
        };
        utils.get_unclaimed_token_fees.mockResolvedValue(
            mock_unclaimed_token_fees
        );

        const result = await pools.calculate_lp(pool_address, user_address);

        expect(result).toEqual({
            token_0: expect.any(String),
            token_1: expect.any(String),
            token_0_symbol: expect.any(String),
            token_1_symbol: expect.any(String),
            token_0_value: expect.any(Number),
            token_1_value: expect.any(Number),
            token_0_fees: expect.any(Number),
            token_1_fees: expect.any(Number),
            fee_tier: expect.any(Number),
            nft_id: expect.any(Number),
            min_tick: expect.any(Number),
            max_tick: expect.any(Number),
        });

        expect(result).toEqual({
            token_0: token_0,
            token_1: token_1,
            token_0_symbol: token_0_symbol,
            token_1_symbol: token_1_symbol,
            token_0_value: 9999,
            token_1_value: 111,
            token_0_fees: 10,
            token_1_fees: 20,
            fee_tier: fee_tier,
            nft_id: 123,
            min_tick: -100,
            max_tick: 100,
        });

        expect(validations.is_address_valid).toHaveBeenCalledWith(
            pool_address,
            "lp"
        );
        expect(validations.is_address_valid).toHaveBeenCalledWith(
            user_address,
            "user's wallet"
        );
        expect(validations.is_pool_address_valid).toHaveBeenCalledWith(
            pool_address
        );
        expect(utils.get_pool).toHaveBeenCalledWith(pool_address);
        expect(utils.get_token_symbols).toHaveBeenCalledWith(token_0, token_1);
        expect(utils.get_token_values).toHaveBeenCalledWith(
            pool_address,
            token_0,
            token_1
        );
        expect(utils.get_position_ids).toHaveBeenCalledWith(user_address);
        expect(utils.get_position).toHaveBeenCalledWith(
            mock_position_ids,
            token_0,
            token_1,
            fee_tier
        );
        expect(utils.get_unclaimed_token_fees).toHaveBeenCalledWith(
            mock_position.id,
            user_address,
            token_0,
            token_1
        );
    });

    it("should handle invalid pool address", async () => {
        const pool_address = "0x000";
        const user_address = "0xe403043A0F9C7B9F315Cf145166EB747D9790E77";

        validations.is_address_valid.mockReturnValueOnce(false);

        const result = await pools.calculate_lp(pool_address, user_address);

        expect(result).toBeUndefined();
        expect(validations.is_address_valid).toHaveBeenCalledWith(
            pool_address,
            "lp"
        );
        expect(validations.is_address_valid).not.toHaveBeenCalledWith(
            user_address,
            "user's wallet"
        );
    });

    it("should handle invalid user address", async () => {
        const pool_address = "0x7b1E5D984A43eE732de195628d20d05CFaBc3cC7";
        const user_address = "0x000";

        validations.is_address_valid.mockReturnValueOnce(true);
        validations.is_address_valid.mockReturnValueOnce(false);

        const result = await pools.calculate_lp(pool_address, user_address);

        expect(result).toBeUndefined();
        expect(validations.is_address_valid).toHaveBeenCalledWith(
            pool_address,
            "lp"
        );
        expect(validations.is_address_valid).toHaveBeenCalledWith(
            user_address,
            "user's wallet"
        );
    });

    it("should handle exceptions gracefully", async () => {
        const pool_address = "0x7b1E5D984A43eE732de195628d20d05CFaBc3cC7";
        const user_address = "0xe403043A0F9C7B9F315Cf145166EB747D9790E77";

        validations.is_address_valid.mockReturnValue(true);
        validations.is_pool_address_valid.mockResolvedValue(true);

        utils.get_pool.mockRejectedValue(new Error("Test Error"));

        const consoleSpy = jest.spyOn(console, "log").mockImplementation();

        const result = await pools.calculate_lp(pool_address, user_address);

        expect(result).toBeUndefined();
        expect(consoleSpy).toHaveBeenCalledWith(new Error("Test Error"));

        consoleSpy.mockRestore();
    });
});
