const request = require("supertest");
const app = require("../index");

describe("POST /api/calculate_lp", () => {
    const lp_address = "0xab14c2c38dc9dd7081820269dff088ddf0b72ff6";
    const wallet_address = "0xe403043A0F9C7B9F315Cf145166EB747D9790E77";

    test("it should return a 200 status code and a success message", async () => {
        const response = await request(app).post("/api/calculate_lp").send({
            lp_address: lp_address,
            wallet_address: wallet_address,
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Calculated LP token successfully");
        // TODO
        expect(response.body.data).toBe({});
    });

    test("it should return a 400 status code and an error message", async () => {
        const no_lp_address_response = await request(app)
            .post("/api/calculate_lp")
            .send({
                wallet_address: wallet_address,
            });

        expect(no_lp_address_response.status).toBe(400);
        expect(no_lp_address_response.body.error).toBe(
            "LP address and wallet address are required"
        );

        const no_wallet_address_response = await request(app)
            .post("/api/calculate_lp")
            .send({
                lp_address: lp_address,
            });

        expect(no_wallet_address_response.status).toBe(400);
        expect(no_wallet_address_response.body.error).toBe(
            "LP address and wallet address are required"
        );
    });

    // TODO: Non-existent endpoints
    // TODO: Rate limiting
    // TODO: Request processing error
    test("it should limit requests from the same IP address", async () => {
        let response;

        for (let i = 0; i <= 99; i++) {
            if (i == 99) {
                response = await request(app).post("/api/calculate_lp").send({
                    lp_address: lp_address,
                    wallet_address: wallet_address,
                });
            } else {
                await request(app).post("/api/calculate_lp").send({
                    lp_address: lp_address,
                    wallet_address: wallet_address,
                });
            }
        }

        // Assert that the third request receives a 429 Too Many Requests status code
        expect(response).toBe(429);
    });
});
