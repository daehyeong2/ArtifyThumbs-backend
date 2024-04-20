import Inquiry from "../models/Inquiry.js";
import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const createInquiry = async (req, res) => {
  const { body } = req;
  try {
    Inquiry.create(body);
    return res.status(200).json("문의 신청이 완료되었습니다.");
  } catch (error) {
    return res.status(400).json(`에러 발생: ${error}`);
  }
};
export const getAllInquiries = async (req, res) => {
  const { token } = req;
  const { role } = JWT.verify(token, JWT_SECRET);
  if (role !== "admin") {
    return res.status(400).json("권한이 없습니다.");
  }
  const inquiries = await Inquiry.find().sort({
    isAnswered: 1,
    createdAt: -1,
  });
  return res.status(200).json(inquiries);
};
export const getInquiry = async (req, res) => {
  const {
    token,
    body: { inquiryId },
  } = req;
  const { role } = JWT.verify(token, JWT_SECRET);
  if (role !== "admin") {
    return res.status(400).json("권한이 없습니다.");
  }
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    return res.status(404).json("없는 문의입니다.");
  }
  return res.status(200).json(inquiry);
};
