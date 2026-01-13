import bcrypt from "bcryptjs";
import dbConnect from "@/backend/lib/db";
import User from "@/backend/models/user.model";

export const userService = {
  async createUser(email: string, password: string, name?: string) {
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    });

    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  },

  async verifyUser(email: string, password: string) {
    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  },

  async getUserById(id: string) {
    await dbConnect();

    const user = await User.findById(id);
    if (!user) {
      return null;
    }

    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  },
};
