import JWT from "jsonwebtoken";

export const getUser = async (req, res) => {
  const user = JWT.decode(req.token);
  return res.status(200).json(user);
};
