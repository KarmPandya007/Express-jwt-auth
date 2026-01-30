import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find().select('-password');
        res.status(200).json({
            success: true,
            count: allUsers.length,
            users: allUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching users: ${error.message}`
        });
    }
}

/**
 * Get user by ID
 * Users can view their own profile, managers and admins can view any profile
 */
export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if user is accessing their own profile or is admin/manager
        if (req.user.id !== id && req.user.role === 'user') {
            return res.status(403).json({
                success: false,
                message: "You can only view your own profile"
            });
        }

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching user: ${error.message}`
        });
    }
}

/**
 * Update user by ID
 * Users can update their own profile (except role), admins can update any profile
 */
export const updateUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const { username, password, role } = req.body;

        // Check if user is updating their own profile or is admin
        if (req.user.id !== id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You can only update your own profile"
            });
        }

        // Prevent non-admins from changing roles
        if (role && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Only admins can change user roles"
            });
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (role && req.user.role === 'admin') updateData.role = role;

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `User updated successfully`,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error updating user: ${error.message}`
        });
    }
}

/**
 * Delete user by ID (Admin only)
 */
export const deleteUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found`
            });
        }

        res.status(200).json({
            success: true,
            message: `User ${user.username} deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error deleting user: ${error.message}`
        });
    }
}

/**
 * Delete all users (Admin only - use with caution!)
 */
export const deleteAllUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({});
        res.status(200).json({
            success: true,
            message: `All users deleted`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error deleting users: ${error.message}`
        });
    }
}
