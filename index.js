const express = require('express');
const constants = require("./lib/constants");
const liquidity_pool = require("./lib/liquidity_pool");

const app = express();
const port = constants.APP_PORT;

app.use(express.json());

app.post('/api/calculate_lp', async (req, res) => {
    const { lp_address, wallet_address } = req.body;

    // Check if lp_address and wallet_address are provided
    if (!lp_address || !wallet_address) {
        return res.status(400).json({ error: 'LP address and wallet address are required' });
    }

    try {
        const calc_result = await liquidity_pool.calculate_lp(lp_address, wallet_address);

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
