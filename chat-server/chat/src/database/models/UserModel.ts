import mongoose, { Document, Schema } from "mongoose";
import { IConversation } from "./ConversationModel";

export interface IUser extends Document {
  name: string;
  email: string;
  conversations: IConversation[];
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name must be provided"],
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
    },
    conversations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
