import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const postSignup = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email && !username && !password) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }
  const lowerEmail = email.toLowerCase();
  const lowerUsername = username.toLowerCase();
  const EmailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!EmailRegExp.test(lowerEmail)) {
    return res
      .status(400)
      .json({ message: "이메일 형식이 올바르지 않습니다." });
  }
  const UsernameRegExp = /^[a-zA-Z0-9]{4,12}$/;
  if (!UsernameRegExp.test(lowerUsername)) {
    return res.status(400).json({
      message: "아이디는 영문, 숫자를 포함한 4~12자로 입력해주세요.",
    });
  }
  const PasswordRegExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/;
  if (!PasswordRegExp.test(password)) {
    return res.status(400).json({
      message: "비밀번호는 영문, 숫자를 포함한 8~16자로 입력해주세요.",
    });
  }
  const EmailDuplicate = await User.findOne({ lowerEmail });
  if (EmailDuplicate) {
    return res.status(400).json({ message: "이미 가입된 이메일입니다." });
  }
  const UsernameDuplicate = await User.findOne({ lowerUsername });
  if (UsernameDuplicate) {
    return res.status(400).json({ message: "이미 가입된 이름입니다." });
  }
  const user = await User.create({
    email: lowerEmail,
    username: lowerUsername,
    password,
  });
  req.session.loggedIn = true;
  req.session.user = user;
  return res.status(200).json("회원가입 완료.");
};

export const postSignin = async (req, res) => {
  const { email, password } = req.body;
  const lowerEmail = email.toLowerCase();
  if (!email && !password) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }
  const user = await User.findOne({ email: lowerEmail });
  if (!user) {
    return res.status(400).json({ message: "가입되지 않은 이메일입니다." });
  }
  const compare = await bcrypt.compare(password, user.password);
  if (!compare) {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.status(200).json("로그인 완료.");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.status(200).json("로그아웃 완료.");
};
