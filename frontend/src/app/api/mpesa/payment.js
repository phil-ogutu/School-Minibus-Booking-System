// this is the payment API handler for M-Pesa STK Push
import axios from "axios";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { token, phoneNumber, amount } = req.body;
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const password = Buffer.from(
    `${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`
  ).toString("base64");
  const payload = {
    BusinessShortCode: process.env.SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: process.env.SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: process.env.CALLBACK_URL,
    AccountReference: "SkoolaBus",
    TransactionDesc: "Booking payment",
  };
  try {
    const resp = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ success: true, data: resp.data });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: error.response?.data || error.message });
  }
}
//  Check out this write up for more details:

// It processes payment requests by sending a request to the M-Pesa API with the necessary parameters
// It expects a POST request with a JSON body containing the token, phone number, and amount
// The handler constructs the required payload, including a timestamp and password, and sends it to the M-Pesa API
// If successful, it returns the response data; if an error occurs,
// it returns a 500 status with the error details
// Ensure that the environment variables SHORTCODE, PASSKEY, CALLBACK_URL, MPESA_KEY,
// and MPESA_SECRET are set correctly in your environment for this to work
// This code is designed to work with the M-Pesa sandbox environment for testing purposes
// Make sure to replace the sandbox URLs with production URLs when deploying to production
// The handler also checks if the request method is POST and returns a 405 status for other methods
// The timestamp is formatted to match the M-Pesa requirements, and the password is base64 encoded
// The payload includes all necessary fields as per M-Pesa's STK Push API
