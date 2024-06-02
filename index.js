const express = require('express');
const constants = require("./lib/constants");
const liquidity_pool = require("./lib/liquidity_pool");

const app = express();
const port = constants.APP_PORT;

app.use(express.json());

// Catch-all middleware for non-existent endpoints
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.post('/api/calculate_lp', async (req, res) => {
    const { lp_address, wallet_address } = req.body;

    // Validate request body
    if (!lp_address) {
        return res.status(400).json({ error: 'LP address is required' });
    }

    if (!wallet_address) {
        return res.status(400).json({ error: 'Wallet address is required' });
    }

    if (!lp_address && !wallet_address) {
        return res.status(400).json({ error: 'LP address and wallet address are required' });
    }

    try {
        const calc_result = await liquidity_pool.calculate_lp(lp_address, wallet_address);
        // TODO: Debug function calculate_lp
        console.log("calc: ", await calc_result);

        // Check if calc_result is a valid result
        if (calc_result === null || typeof calc_result === 'undefined') {
            return res.status(422).json({ error: 'Invalid result from calculate_lp function' });
        }

        return res.status(200).json({ message: 'Calculated LP token successfully', data: { calc_result }});
    } catch(e) {
        return res.status(422).json({ error: e });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
