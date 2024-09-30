"use strict";
// import axios from "axios"; // Use this line only if running in a Node.js environment
// import config from "../../../config";
// import { TUser } from "../user/user.interface";
// const url = config.PAYMENT_URL;
// const headers = {
//   "Content-Type": "application/json",
// };
// export async function sendPaymentRequestFull(paymentData: {
//   TotalPayTran_id: string;
//   UserData: TUser;
//   amount?: number; // Optional field for dynamic amount
// }) {
//   const payload = {
//     store_id: config.STORE_ID,
//     signature_key: config.SIGNATURE_KEY,
//     tran_id: paymentData.TotalPayTran_id,
//     success_url: `https://bike-rental-service-backend-two.vercel.app/api/payment/TotalPayConfirmation?TotalPayTran_id=${paymentData.TotalPayTran_id}&status=success`,
//     fail_url: `https://bike-rental-service-backend-two.vercel.app/api/payment/TotalPayFailed?TotalPayTran_id=${paymentData.TotalPayTran_id}&status=failed`,
//     cancel_url: "https://cox-s-sea-side-bike-frontend.vercel.app/",
//     amount: (paymentData.amount || 100).toFixed(2), // Use dynamic amount if provided, fallback to 100
//     currency: "BDT",
//     desc: "Total Payment",
//     cus_name: paymentData.UserData.name,
//     cus_email: paymentData.UserData.email,
//     cus_add1: paymentData.UserData.address || "", // Ensure address is a string and handle undefined/null
//     cus_add2: "", // Additional address field if needed
//     cus_city: "", // Add city if available in TUser
//     cus_state: "", // Add state if available in TUser
//     cus_postcode: "", // Add postcode if available in TUser
//     cus_country: "", // Add country if available in TUser
//     cus_phone: paymentData.UserData.phone?.toString() || "", // Ensure phone is a string and handle undefined/null
//     type: "json",
//   };
//   try {
//     const response = await axios.post(url as string, payload, { headers });
//     return response.data;
//   } catch (error) {
//     console.error("Error sending payment request:", error);
//     throw error;
//   }
// }
// export async function verifyPayment(tnxId: string) {
//   const verifyUrl = `${config.PAYMENT_VERIFY_URL}`; // URL to verify the payment
//   try {
//     const response = await axios.get(verifyUrl, {
//       params: {
//         store_id: config.STORE_ID,
//         signature_key: config.SIGNATURE_KEY,
//         type: "json",
//         request_id: tnxId,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Payment validation failed:", error);
//     throw new Error("Payment validation failed!");
//   }
// }
