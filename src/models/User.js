import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
    match: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  avatar: {
    type: String,
    default:
      "https://cdn.discordapp.com/attachments/1185437332569075782/1223602682124697620/16b2dc09f85032eb.png?ex=661a73cc&is=6607fecc&hm=a71f50375a4af0b84cebfc58a108207e65c2e1c47b65b6a0a91cbb576dc06d2c&",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model("User", userSchema, "users");
export default User;
