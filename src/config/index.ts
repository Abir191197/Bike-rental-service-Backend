import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  SESSION_SECRET: process.env.SESSION_SECRET,
  CLIENT_REDIRECT_URL: process.env.CLIENT_REDIRECT_URL,
  callbackURL: process.env.callbackURL,
  Google_Redirect_Url: process.env.Google_Redirect_Url,
  STORE_ID : process.env.STORE_ID,
  SIGNATURE_KEY : process.env.SIGNATURE_KEY,
  PAYMENT_URL : process.env.PAYMENT_URL,
  PAYMENT_VERIFY_URL : process.env.PAYMENT_VERIFY_URL,
};
