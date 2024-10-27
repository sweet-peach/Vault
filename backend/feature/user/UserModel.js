import {Schema, model} from "mongoose";

const User = new Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    diskSpace: {type: Number, require: true, default:5024**10},
    usedSpace: {type: Number, require: true, default: 0},
    avatar: {type: String},
    files: {type: Schema.Types.ObjectId, ref:'File'}
})

export const UserModel = model('User', User);