import { Schema, model, Types } from "mongoose";

const RolePlaySchema = new Schema({
    type: {
        unique: true,
        type: String,
    },
    images: [String],
});

export const rolePlay = model("RolePlay", RolePlaySchema);

export interface RolePlay {
    _id: Types.ObjectId;
    type: string;
    images: Array<string>;
}
