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
    default:
      "https://cdn.discordapp.com/attachments/1185437332569075782/1223603691831951450/3.png?ex=661a74bd&is=6607ffbd&hm=7551385b8c0354a8d299012e343f94682da00e9815c7776702e484e88702e00c&",
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
