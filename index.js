const express = require("express");
const rate_limit = require("express-rate-limit");
const constants = require("./lib/constants");
const liquidity_pool = require("./lib/liquidity_pool");

const app = express();
const port = constants.APP_PORT;

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
        if (!pool_address && !user_address) {
            return res
                .status(400)
                .json({ error: "Pool address and user address are required" });
        }

        const calc_result = await liquidity_pool.calculate_lp(
            pool_address,
            user_address
        );

        // TODO: Debug function calculate_lp
        console.log("calc: ", await calc_result);

        // Check if calc_result is a valid result
        if (calc_result === null || typeof calc_result === "undefined") {
            return res
                .status(422)
                .json({ error: "Invalid result from calculate_lp function" });
        }

        return res.status(200).json(calc_result);
    } catch (e) {
        return res.status(422).json({ error: e });
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
