import {Schema, model, Types} from "mongoose";

const UserSchema = new Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    diskSpace: {type: Number, require: true, default:1024 * 1024 * 10},
    usedSpace: {type: Number, require: true, default: 0},
    avatar: {type: String},
    files: {type: Types.ObjectId, ref:'File'}
})

const UserModel = model('User', UserSchema);

export default UserModel;

