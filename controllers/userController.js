import { User } from '../models/User.js';

export const getAllUsers = async (req, res) => {
    const allUsers = await User.find();
    res.status(200).json({
        success: true,
        allUsers
    });
}


export const getUserById = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json({
        success: true,
        user
    });
}

export const createUser = async (req, res) => {
    const { email, name, password } = req.body;
    const newUser = new User({
        email, name, password
    });
    await newUser.save();
    res.status(201).json({
        success: true,
        message: `New user with name ${name} added`,
        user: newUser
    });
}

export const updateUserById = async (req, res) => {
    const id = req.params.id;
    const { name, password, email } = req.body;
    const user = await User.findOneAndUpdate({ _id: id }, { name, password, email }, { new: true });
    res.status(200).json({
        success: true,
        message: `User with name ${name} updated`,
        user
    });
}

export const deleteUserById = async (req, res) => {
    const id = req.params.id
    const user = await User.findOneAndDelete({ _id: id })
    if (user) {
        res.status(200).json({
            success: true,
            message: `User with id ${id} deleted`
        });
    } else {
        res.status(404).json({
            success: false,
            message: `User not found`
        });
    }
}

export const deleteAllUsers = async(req, res) => {
    const user = await User.deleteMany({});
    res.status(200).json({
        success: true,
        message: `All users deleted`
    });
}
