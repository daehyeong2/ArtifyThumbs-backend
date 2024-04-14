import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 12,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  avatar: {
    type: String,
    default: "/img/user.jpeg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orders: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model("User", userSchema, "users");
export default User;
