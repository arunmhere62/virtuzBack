import { UserLogin } from "../models/user.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import bcrypt from "bcrypt";

// ! ------ login -------
const userLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    try {
        const foundUser = await UserLogin.findOne({ username }).exec();

        if (!foundUser) {
            return res.sendStatus(401);
        }

        if (foundUser.password !== password) {
            return res.sendStatus(401);
        }

        // Create access token
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                }
            },
            "secret-key",
            { expiresIn: '30d' }
        );

        let refreshToken = foundUser.refreshToken.find(token => {
            try {
                jwt.verify(token, "secret-key");
                return true;
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    return false;
                } else {
                    throw err;
                }
            }
        });

        if (!refreshToken) {
            refreshToken = jwt.sign(
                { "username": foundUser.username },
                "secret-key",
                { expiresIn: '30d' }
            );
            foundUser.refreshToken.push(refreshToken);
            await foundUser.save();
        }

        const userDetails = foundUser.toObject();
        res.json({ ...userDetails, accessToken, refreshToken });
    } catch (error) {
        console.error("Error occurred during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ! ------  handle new user  -------
const userRegistration = async (req, res) => {
    const { username, email, dob, password, address, city, state, job } = req.body;

    try {
        const existingUser = await UserLogin.findOne({
            $or: [{ username }]
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const newUser = new UserLogin({
            username,
            email,
            dob,
            password,
            address,
            city,
            state,
            job
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// -----------------------------to update all users-----------------------------------
const updateUserData = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const result = await UserLogin.findByIdAndUpdate(id, update, { new: true });
        if (!result) {
            return res.status(404).json({ message: "user not found" })
        }
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" })
    }
}


const getUserData = async (req, res) => {
    try {
        const { key, value } = req.query;
        const query = { [key]: value };
        const result = await UserLogin.findOne(query);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// -----------------------------to get all users-----------------------------------
const getAllUsers = async (req, res) => {
    try {
        const users = await UserLogin.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getUserByNameOrId = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserLogin.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export { userLogin, userRegistration, getUserData, updateUserData, getAllUsers, getUserByNameOrId };
