"use strict";
// import { readFileSync } from "fs";
// import { join } from "path";
// import { verifyPayment } from "./payment.utils";
// const confirmationService = async (bookingId: string, status: string) => {
//   try {
//     // Verify the payment status using the transaction/order ID
//     const verifyResponse = await verifyPayment(bookingId);
//     let statusMessage;
//     let templateFile;
//     // Determine status message and template based on verification response
//     if (status === "success" && verifyResponse.pay_status === "Successful") {
//       statusMessage = "Payment successful";
//       templateFile = "ConfirmationSuccess.html";
//       // Update the payment status in the database
//       await BookingModel.findOneAndUpdate(
//         { bookingId },
//         { advancePayment: "Paid" }
//       );
//     } else if (verifyResponse.pay_status === "Failed") {
//       statusMessage = "Payment failed";
//       templateFile = "ConfirmationFailure.html";
//       // Update the payment status in the database
//       const bikeBooking = await BookingModel.findOneAndUpdate(
//         { bookingId },
//         { advancePayment: "Failed" }
//       );
//       // If booking is found, update the bike availability
//       if (bikeBooking) {
//         await BikeModel.findByIdAndUpdate(
//           bikeBooking.bikeId,
//           { isAvailable: true },
//           { new: true, runValidators: true }
//         );
//       } else {
//         throw new Error("Booking not found for the given booking ID");
//       }
//     } else {
//       throw new Error("Unexpected payment status or response");
//     }
//     // Read and modify the HTML template
//     const filePath = join(__dirname, `../../../views/${templateFile}`);
//     let template;
//     try {
//       template = readFileSync(filePath, "utf-8");
//     } catch (fileError) {
//       console.error("Error reading template file:", fileError);
//       throw new Error("Template file not found");
//     }
//     // Replace placeholder in the template
//     template = template.replace("{{message}}", statusMessage);
//     return template;
//   } catch (error) {
//     console.error("Error in confirmationService:", error);
//     throw new Error("Failed to confirm payment");
//   }
// };
// const TotalPayConfirmationService = async (
//   TotalPayTran_id: string,
//   status: string
// ) => {
//   try {
//     // Verify the payment status using the transaction/order ID
//     const verifyResponse = await verifyPayment(TotalPayTran_id);
//     let statusMessage;
//     let templateFile;
//     // Determine status message and template based on verification response
//     if (status === "success" && verifyResponse.pay_status === "Successful") {
//       statusMessage = "Payment successful";
//       templateFile = "ConfirmationSuccess.html";
//       // Update the payment status in the database
//       await BookingModel.findOneAndUpdate(
//         { TotalPayTran_id },
//         { totalCostPayment: "Paid" }
//       );
//     } else if (verifyResponse.pay_status === "Failed") {
//       statusMessage = "Payment failed";
//       templateFile = "ConfirmationFailure.html";
//       // Update the payment status in the database
//       await BookingModel.findOneAndUpdate(
//         { TotalPayTran_id },
//         { totalCostPayment: "Failed" }
//       );
//     } else {
//       throw new Error("Unexpected payment status or response");
//     }
//     // Read and modify the HTML template
//     const filePath = join(__dirname, `../../../views/${templateFile}`);
//     let template;
//     try {
//       template = readFileSync(filePath, "utf-8");
//     } catch (fileError) {
//       console.error("Error reading template file:", fileError);
//       throw new Error("Template file not found");
//     }
//     // Replace placeholder in the template
//     template = template.replace("{{message}}", statusMessage);
//     return template;
//   } catch (error) {
//     console.error("Error in TotalPayConfirmationService:", error);
//     throw new Error("Failed to confirm payment");
//   }
// };
// export const paymentServices = {
//   confirmationService,
//   TotalPayConfirmationService,
// };
