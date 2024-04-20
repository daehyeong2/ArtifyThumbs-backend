import JWT from "jsonwebtoken";

export const getUser = async (req, res) => {
  const user = JWT.verify(req.token, process.env.JWT_SECRET);
  return res.status(200).json(user);
};
