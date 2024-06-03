const express = require("express");
const rate_limit = require("express-rate-limit");
const supertest = require("supertest");
const constants = require("../lib/constants");
const pools = require("../lib/pools");
const utils = require("../lib/utils");

const app = express();
const port = constants.APP_TEST_PORT;

// Mock the pools module
jest.mock("../lib/pools", () => ({
    calculate_lp: jest.fn(),
}));

// Rate limiting middleware
app.use(
    rate_limit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: "Too many requests from this IP, please try again later.",
    })
);

app.use(express.json());

app.post("/api/calculate_lp", async (req, res) => {
    try {
        const { pool_address, user_address } = req.body;

        // Validate request body
        if (!pool_address || !user_address) {
            return res
                .status(400)
                .json({ error: "Pool address and user address are required" });
        }

        const result = await pools.calculate_lp(pool_address, user_address);

        if (result === null || typeof result === "undefined") {
            return res
                .status(422)
                .json({ error: "Invalid result from calculate_lp function" });
        }

        return res.status(200).json(result);
    } catch (e) {
        return res.status(422).json({ error: "Internal server error" });
    }
});

// Catch-all middleware for non-existent endpoints
app.use((req, res, next) => {
    res.status(404).json({ error: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(port);

describe("POST /api/calculate_lp", () => {
    const request = supertest(app);

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        server.close();
    });

    it("should calculate LP successfully with valid inputs", async () => {
        const mock_result = {
            token_0: "0xToken0",
            token_1: "0xToken1",
            token_0_symbol: "TOKEN0",
            token_1_symbol: "TOKEN1",
            token_0_value: 100,
            token_1_value: 200,
            token_0_fees: 10,
            token_1_fees: 20,
            fee_tier: 3000,
            nft_id: 123,
            min_tick: -100,
            max_tick: 100,
        };

        pools.calculate_lp.mockResolvedValue(mock_result);

        const request_body = {
            pool_address: "0xValidPoolAddress",
            user_address: "0xValidUserAddress",
        };

        const response = await request
            .post("/api/calculate_lp")
            .send(request_body)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(response.body).toEqual(mock_result);
        expect(pools.calculate_lp).toHaveBeenCalledWith(
            request_body.pool_address,
            request_body.user_address
        );
    });

    it("should return 400 if pool_address or user_address is missing", async () => {
        const request_body = {
            pool_address: "0xValidPoolAddress",
        };

        const response = await request
            .post("/api/calculate_lp")
            .send(request_body)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(response.body).toEqual({
            error: "Pool address and user address are required",
        });
        expect(pools.calculate_lp).not.toHaveBeenCalled();
    });

    it("should return 422 if calculate_lp function returns undefined", async () => {
        const request_body = {
            pool_address: "0xValidPoolAddress",
            user_address: "0xValidUserAddress",
        };

        pools.calculate_lp.mockResolvedValue(undefined);

        const response = await request
            .post("/api/calculate_lp")
            .send(request_body)
            .expect("Content-Type", /json/)
            .expect(422);

        expect(response.body).toEqual({
            error: "Invalid result from calculate_lp function",
        });
        expect(pools.calculate_lp).toHaveBeenCalledWith(
            request_body.pool_address,
            request_body.user_address
        );
    });

    it("should handle internal server error", async () => {
        const request_body = {
            pool_address: "0xValidPoolAddress",
            user_address: "0xValidUserAddress",
        };

        pools.calculate_lp.mockRejectedValue(new Error("Test error"));

        const response = await request
            .post("/api/calculate_lp")
            .send(request_body)
            .expect("Content-Type", /json/)
            .expect(422);

        expect(response.body).toEqual({
            error: "Internal server error",
        });
        expect(pools.calculate_lp).toHaveBeenCalledWith(
            request_body.pool_address,
            request_body.user_address
        );
    });

    it("should return 404 for non-existent endpoint", async () => {
        const response = await request
            .get("/nonexistentendpoint")
            .expect("Content-Type", /json/)
            .expect(404);

        expect(response.body).toEqual({
            error: "Endpoint not found",
        });
    });
});
