import User from "../models/User.js";
import Order from "../models/Order.js";
import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const postApply = async (req, res) => {
  const {
    token,
    body: { plan, kind, title, content },
  } = req;
  try {
    const { _id } = JWT.verify(token, JWT_SECRET);
    const user = await User.findById(_id);
    const newOrder = await Order.create({
      orderer: user,
      title,
      description: content,
      tags: [kind],
      plan,
    });
    user.orders.push(newOrder);
    user.save();
    return res
      .status(200)
      .json({ message: "신청을 성공했습니다.", orderId: newOrder._id });
  } catch (e) {
    console.log(e);
    return res.status(400).json("신청을 실패했습니다.");
  }
};

export const getApplication = async (req, res) => {
  const {
    token,
    body: { id },
  } = req;
  const { _id, role } = JWT.verify(token, JWT_SECRET);
  const order = await Order.findById(id).populate("orderer");
  if (!order) {
    return res.status(404).json("없는 주문입니다.");
  }
  if (role === "admin" || order.orderer._id + "" === _id) {
    return res.status(200).json({ order });
  } else {
    return res.sendStatus(403);
  }
};

export const getApplications = async (req, res) => {
  const { token } = req;
  const { role } = JWT.verify(token, JWT_SECRET);
  if (role !== "admin") {
    return res.status(400).json("권한이 없습니다.");
  }
  const orders = await Order.find().sort({ isComplete: 1, applyedAt: -1 });
  return res.status(200).json(orders);
};

export const getMyApplications = async (req, res) => {
  const { token } = req;
  const { _id } = JWT.verify(token, JWT_SECRET);
  try {
    const applications = await Order.find({ orderer: _id }).sort({
      applyedAt: "desc",
    });
    return res.status(200).json(applications);
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};
