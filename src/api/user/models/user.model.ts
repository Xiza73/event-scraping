import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
    versionKey: false,
    strict: false,
  },
  options: { allowMixed: Severity.ALLOW },
})
export class User {
  @prop({ type: String, required: true, unique: true })
  firebaseId: string;

  @prop({ type: String })
  name: string;

  @prop({ type: String })
  lastName: string;

  @prop({
    type: String,
    unique: true,
    sparse: true,
  })
  username: string;

  @prop({ type: String })
  phoneNumber: string;

  @prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @prop({ type: Boolean, default: false })
  hasCompletedProfile: boolean;

  @prop({ type: Boolean, default: true })
  isActive: boolean;

  @prop({ type: Boolean, default: false })
  isAdmin: boolean;
}

export const UserModel = getModelForClass(User);
