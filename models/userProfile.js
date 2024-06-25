import mongoose from "mongoose";

const userProfile = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    job: {
        type: String,
        required: true,
    }
});

const UserProfileSchema = mongoose.model("UserProfile", userProfile);

export { UserProfileSchema };
