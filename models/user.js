import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    default: null,
  },
  dob: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
  job: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: [String],
    default: [],
  },
});

const UserLogin = mongoose.model("UserLogin", userSchema);

export { UserLogin };
