import User from "../models/User.js";

export const getUser = async (req, res) => {
  const loggedIn = req.session.loggedIn;
  if (!loggedIn) {
    return res.status(200).json({ loggedIn: false });
  }
  const user = await User.findById(req.session.user._id).populate({
    path: "orders",
    options: {
      sort: { applyedAt: "desc" },
    },
  });
  return res.status(200).json({ loggedIn: true, user });
};
