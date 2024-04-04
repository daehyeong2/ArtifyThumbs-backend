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
      user: { _id },
    },
    body: { id },
  } = req;
  const order = await Order.findById(id);
  if (order.orderer + "" === _id) {
    return res.status(200).json({ order });
  } else {
    return res.status(400).json("실패");
  }
};
