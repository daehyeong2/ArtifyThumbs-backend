import User from "../models/User.js";
import Order from "../models/Order.js";

export const postApply = async (req, res) => {
  const {
    session: { loggedIn },
  } = req;
  if (!loggedIn) {
    return res.status(400).json("로그인이 필요한 서비스입니다.");
  }
  const {
    session: {
      user: { _id },
    },
    body: { plan, kind, title, content },
  } = req;
  try {
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
    session: { loggedIn },
  } = req;
  if (!loggedIn) {
    return res.status(400).json("로그인이 필요한 서비스입니다.");
  }
  const {
    session: {
      user: { _id, role },
    },
    body: { id },
  } = req;
  const order = await Order.findById(id).populate("orderer");
  if (!order) {
    return res.status(404).json("없는 주문입니다.");
  }
  if (role === "admin" || order.orderer + "" === _id) {
    return res.status(200).json({ order });
  } else {
    return res.status(400).json("권한 없음.");
  }
};

export const getApplications = async (req, res) => {
  const {
    session: { loggedIn },
  } = req;
  if (!loggedIn) {
    return res.status(400).json("로그인이 필요한 서비스입니다.");
  }
  const {
    session: {
      user: { role },
    },
  } = req;
  if (role !== "admin") {
    return res.status(400).json("권한이 없습니다.");
  }
  const orders = await Order.find().sort({ isComplete: 1, applyedAt: -1 });
  return res.status(200).json(orders);
};
