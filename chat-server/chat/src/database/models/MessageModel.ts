import mongoose, { Document, Schema } from "mongoose";

enum Status {
  NotDelivered = "NotDelivered",
  Delivered = "Delivered",
  Seen = "Seen",
}

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  message: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.NotDelivered,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
