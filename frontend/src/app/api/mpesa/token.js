// This is the M-Pesa token API handler
import axios from "axios";
export default async function handler(_, res) {
  const auth = Buffer.from(
    `${process.env.MPESA_KEY}:${process.env.MPESA_SECRET}`
  ).toString("base64");
  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
  res.json({ token: response.data.access_token });
}

// Check out this write up for more details:

// It generates an access token for M-Pesa API authentication
// It uses the client credentials grant type to obtain the token
// The handler sends a GET request to the M-Pesa OAuth endpoint with the necessary headers
// The access token is returned in the response as JSON
// Ensure that the environment variables MPESA_KEY and MPESA_SECRET are set correctly in your environment
// This code is designed to work with the M-Pesa sandbox environment for testing purposes
// Make sure to replace the sandbox URLs with production URLs when deploying to production
// The handler does not require any request body and responds with the token in JSON format
// The token is used for subsequent API requests to M-Pesa services
// The handler does not check the request method since it is a simple token generation endpoint
// The token is valid for a limited time, so it may need to be refreshed periodically
// The response includes the access token which can be used in the Authorization header for M-Pesa
// API requests
