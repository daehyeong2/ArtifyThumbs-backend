import mongoose from "mongoose";

const planMaxDescriptionLengths = {
  standard: 500,
  pro: 1500,
};

const tag_list = {
  "youtube-thumbnail": "유튜브 썸네일",
  banner: "프로필 배너",
  profile: "프로필 사진",
  "game-illustration": "게임 일러스트",
  "character-design": "캐릭터 디자인",
  etc: "기타",
};

const orderSchema = new mongoose.Schema({
  orderer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    maxlength: 30,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  result: {
    type: String,
    default: "",
  },
  drafts: [
    {
      imageUrl: String,
      title: String,
    },
  ],
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  plan: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  chats: [
    {
      message: String,
      isMe: Boolean,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  applyedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", function (next) {
  const maxDescriptionLength = planMaxDescriptionLengths[this.plan];
  if (maxDescriptionLength && this.description.length > maxDescriptionLength) {
    const error = new Error(
      `Description exceeds maximum length for plan ${this.plan}`
    );
    return next(error);
  }
  next();
});

orderSchema.pre("save", function () {
  this.tags = this.tags.map((tag) => tag_list[tag]);
});

const Order = mongoose.model("Order", orderSchema, "orders");
export default Order;
