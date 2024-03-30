export const getUser = (req, res) => {
  const loggedIn = req.session.loggedIn;
  if (!loggedIn) {
    return res.status(200).json({ loggedIn: false });
  }
  const user = req.session.user;
  return res.status(200).json({ loggedIn: true, user });
};
