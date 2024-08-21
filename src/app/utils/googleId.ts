import UserModel from "../modules/user/user.model";

export const getNextGoogleId = async () => {
  const maxUser = await UserModel.findOne({}, { googleId: 1 })
    .sort({ googleId: -1 })
    .exec();
  if (!maxUser || maxUser.googleId === null) {
    return 1; // Start from 1 if no users exist or if all `googleId`s are null
  }
  return maxUser.googleId + 1; // Increment the highest value
};
