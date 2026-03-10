/**
 * User controller – list all users and get one user by id (password excluded).
 */
import User from '../models/user.model.js'

/** Return all users. No auth – use with care in production. */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

/** Return a single user by id; requires auth. Password is excluded from the response. */
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// FIXME: Implement create user (validation, hashing password, etc.) (DONE?)
export const createUser = async (req, res, next) => {

  // Hash password and validate input are handled by the User model's pre-save hook and validation, so we can just pass the body to User.create. The inputValidationMiddleware ensures the body is not empty and is JSON.
  // Should use inputvalidationMiddleware to check for empty body and valid JSON before this controller runs, but we can also add a check here for extra safety.
  try {
    // Basic validation to check if body is empty or not JSON (in case the middleware is not used or fails for some reason)
    const body = req.body;
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      const error = new Error(
        "Request body is empty or not JSON. In Postman: Body → raw → JSON, and add header Content-Type: application/json"
      );
      error.statusCode = 400;
      throw error;
    }
    const user = await User.create(body);

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
   }
}

// DONE
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    // Ensure the authenticated user is updating their own profile
    if (req.user._id.toString() !== userId) {
      const error = new Error('Unauthorized: You can only update your own profile');
      error.statusCode = 403;
      throw error;
    }
    
    // Update the user with the provided data (name, email, password)
    const updatedData = req.body;
    const updatedUser = await User.find
      .findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true })
      .select('-password'); // Exclude password from the response

    if (!updatedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
}

// DONE
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Ensure the authenticated user is deleting their own profile
    if (req.user._id.toString() !== userId) {
      const error = new Error('Unauthorized: You can only delete your own profile');
      error.statusCode = 403;
      throw error;
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: deletedUser });
  } catch (error) {
    next(error);
  }
}