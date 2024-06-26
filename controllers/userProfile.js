import mongoose from "mongoose";
import { UserLogin } from "../models/user.js";
import bcrypt from "bcrypt";

const getUserProfile = async (req, res) => {
    try {
        const users = await UserLogin.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserProfileByUsername = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await UserLogin.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Modify the response to change _id to id
        const { _id, ...userWithoutId } = user.toObject();  // Assuming user is a Mongoose document
        const id = _id.toString();  // Convert _id to string if needed

        // Construct the response with id instead of _id
        res.json({ id, ...userWithoutId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const updateUserProfileById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        // Check if password needs to be hashed
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await UserLogin.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (updatedUser == null) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteUserProfileById = async (req, res) => {
    try {
        const deletedUser = await UserLogin.findByIdAndDelete(req.params.id);
        if (deletedUser == null) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export { getUserProfile, getUserProfileByUsername, updateUserProfileById, deleteUserProfileById }