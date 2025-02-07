import { SignUpRequest } from '@/api/auth/schemas/sign-up.schema';
import { ObjectId } from '@/models/mongoose.model';

import { UserModel } from '../models/user.model';
import { UpdateInfoRequest } from '../schemas/update-info.schema';

export const userRepository = {
  create: async (data: SignUpRequest) => {
    const newUser = new UserModel(data);

    const savedUser = await newUser.save();

    return savedUser;
  },

  updateInfo: async (id: string, data: UpdateInfoRequest) => {
    return await UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  },

  partialUpdateInfo: async (id: string, data: Partial<UpdateInfoRequest>) => {
    return await UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  },

  completeSignUp: async (id: string, data: UpdateInfoRequest) => {
    return await UserModel.findByIdAndUpdate(
      id,
      {
        ...data,
        hasCompletedProfile: true,
      },
      { new: true, runValidators: true }
    ).exec();
  },

  findByEmail: async (email: string) => {
    return await UserModel.findOne({ email }).exec();
  },

  findByFirebaseId: async (firebaseId: string) => {
    return await UserModel.findOne({ firebaseId }).exec();
  },

  findRepeatedPhone: async (firebaseId: string, phoneNumber: string) => {
    return await UserModel.findOne({
      phoneNumber,
      firebaseId: {
        $ne: firebaseId,
      },
    }).exec();
  },

  findRepeatedUsername: async (firebaseId: string, username: string) => {
    return await UserModel.findOne({
      username,
      firebaseId: {
        $ne: firebaseId,
      },
    }).exec();
  },

  findRepeatedEmail: async (firebaseId: string, email: string) => {
    return await UserModel.findOne({
      email,
      firebaseId: {
        $ne: firebaseId,
      },
    }).exec();
  },

  getCompleteUser: async (id: ObjectId) => {
    const usersFound = await UserModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
    ]);

    return usersFound[0];
  },
};
