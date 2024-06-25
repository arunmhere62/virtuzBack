import { UserProfileSchema } from "../models/userProfile.js";

const createUserProfile = async (req, res) => {
    const { username, email, dob, password, address, city, state, job } = req.body;
    const newUser = new UserProfileSchema({ username, email, dob, password, address, city, state, job });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const users = await UserProfileSchema.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const getUserProfileById = async (req, res) => {
    try {
        const user = await UserProfileSchema.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUserProfileById = async (req, res) => {
    try {
        const updatedUser = await UserProfileSchema.findByIdAndUpdate(
            req.params.id,
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
        const deletedUser = await UserProfileSchema.findByIdAndDelete(req.params.id);
        if (deletedUser == null) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export { createUserProfile, getUserProfile, getUserProfileById, updateUserProfileById, deleteUserProfileById }