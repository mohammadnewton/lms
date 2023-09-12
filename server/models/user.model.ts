import mongoose, {Document, Model, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const emailRegexPattern: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  },
  role: string;
  isVerified: boolean;
  courses: Array<{courseId: string}>;
  comparePassword: (password: string) => Promise<boolean>;
}