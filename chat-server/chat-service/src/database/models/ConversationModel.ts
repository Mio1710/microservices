import mongoose, { Document, Schema } from "mongoose";
import { IMessage } from "./MessageModel";
import { IUser } from "./UserModel";

export interface IConversation extends Document {
  lastMessage: IMessage | null;
  users: IUser[];
}

const ConversationSchema: Schema = new Schema(
  {
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message", required: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
export default Conversation;
