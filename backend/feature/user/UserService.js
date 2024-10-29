import BadAvatarError from "./errors/BadAvatarError.js";
import UserModel from "./UserModel.js";
import config from "../../core/config.js";
import path from "node:path";
import fs from "node:fs";
import {getBaseDirectory} from "../../index.js";
import {v4} from "uuid";

const validAvatarExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg', '.ico', '.heic'];

const baseDir = getBaseDirectory();
const avatarsRootDir = config.avatars_directory || path.join(baseDir, 'avatars');

if (!fs.existsSync(avatarsRootDir)) {
    fs.mkdirSync(avatarsRootDir, {recursive: true});
}

class UserService {

    static async uploadAvatar(newAvatar, userId) {
        const extension = newAvatar.name.split('.')[1];
        if (!validAvatarExtensions.includes(`.${extension}`)) {
            throw new BadAvatarError("Invalid avatar extension")
        }
        if (newAvatar.size > config.avatar_maximum_size) {
            throw new BadAvatarError(`New avatar exceed maximum avatar size, which is: ${config.avatar_maximum_size} bytes`)
        }
        const user = await UserModel.findById(userId).exec();

        if (user.avatar) {
            fs.rmSync(path.join(avatarsRootDir, user.avatar));
        }

        const uuidAvatarName = `${v4()}.${extension}`;
        newAvatar.mv(path.join(avatarsRootDir, uuidAvatarName));

        user.avatar = uuidAvatarName;
        await user.save();
        return uuidAvatarName;
    }

    static async deleteAvatar(userId) {
        const user = await UserModel.findById(userId).exec();
        if (user.avatar) {
            fs.rmSync(path.join(avatarsRootDir, user.avatar));
            user.avatar = null;
        }
        await user.save();
    }
}

export default UserService