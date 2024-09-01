import axios from "axios"; // Use this line only if running in a Node.js environment
import config from "../../../config";
import { TUser } from "../user/user.interface";

const url = config.PAYMENT_URL;

const headers = {
  "Content-Type": "application/json",
};

export async function sendPaymentRequest(paymentData: {
  bookingId: string;
  UserData: TUser;
}) {
  // Construct the payload dynamically
  const payload = {
    store_id: config.STORE_ID,
    signature_key: config.SIGNATURE_KEY,
    tran_id: paymentData.bookingId,
    success_url: `https://bike-rental-service-backend-two.vercel.app/api/payment/confirmation?bookingId=${paymentData.bookingId}&status=success`,
    fail_url: `https://bike-rental-service-backend-two.vercel.app/api/payment/confirmation?bookingId=${paymentData.bookingId}&status=failed`, // Fixed to use bookingId instead of orderId
    cancel_url: "https://cox-s-sea-side-bike-frontend.vercel.app/",
    amount: (100).toFixed(2), // Assuming a fixed amount, update as needed
    currency: "BDT", // Assuming BDT as currency, adjust if needed
    desc: "Advance Payment",
    cus_name: `${paymentData.UserData.name}`,
    cus_email: paymentData.UserData.email,
    cus_add1: paymentData.UserData.address, // Assuming this is a single field in TUser
    cus_add2: "", // You can add an additional address field if needed
    cus_city: "", // Add city if available in TUser
    cus_state: "", // Add state if available in TUser
    cus_postcode: "", // Add postcode if available in TUser
    cus_country: "", // Add country if available in TUser
    cus_phone: paymentData.UserData.phone.toString(),
    type: "json",
  };

  try {
    const response = await axios.post(url as string, payload, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function verifyPayment(tnxId: string) {
  const verifyUrl = `${config.PAYMENT_VERIFY_URL}`; // URL to verify the payment

  try {
    const response = await axios.get(verifyUrl, {
      params: {
        store_id: config.STORE_ID,
        signature_key: config.SIGNATURE_KEY,
        type: "json",
        request_id: tnxId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Payment validation failed:", error);
    throw new Error("Payment validation failed!");
  }
}
