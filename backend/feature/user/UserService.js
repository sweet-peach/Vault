import BadAvatarError from "./errors/BadAvatarError.js";
import UserModel from "./UserModel.js";
import config from "../../core/config.js";
import path from "node:path";
import fs from "node:fs";
import {v4} from "uuid";
import InvalidCredentials from "../authentication/errors/InvalidCredentials.js";
import UserNotFoundError from "./errors/UserNotFoundError.js";
import bcrypt from "bcryptjs";
import OldPasswordDoNotMatch from "./errors/OldPasswordDoNotMatch.js";

const validAvatarMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
];

const mimeToExtension = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/bmp': ['.bmp'],
    'image/webp': ['.webp'],
    'image/tiff': ['.tiff'],
    'image/svg+xml': ['.svg'],
    'image/vnd.microsoft.icon': ['.ico'],
    'image/heic': ['.heic']
};

const avatarsRootDir = config.avatars_directory || path.join(baseDir, 'avatars');

if (!fs.existsSync(avatarsRootDir)) {
    fs.mkdirSync(avatarsRootDir, {recursive: true});
}

function userToDto(user){
    return {
        user: {
            id: user.id,
            email: user.email,
            diskSpace: user.diskSpace,
            usedSpace: user.usedSpace,
            avatar: user.avatar
        }
    }
}

class UserService {
    static async getUserById(userId,dto = true){
        const user = await UserModel.findById(userId).exec();
        if(!user){
            throw new UserNotFoundError("User not found");
        }
        if(dto){
            return userToDto(user)
        }
        return user;
    }

    static async uploadAvatar(newAvatar, userId) {
        if (!validAvatarMimeTypes.includes(newAvatar.mimetype)) {
            throw new BadAvatarError("Invalid avatar extension")
        }
        if (newAvatar.size > config.avatar_maximum_size) {
            throw new BadAvatarError(`New avatar exceed maximum avatar size, which is: ${config.avatar_maximum_size} bytes`)
        }
        const user = await UserModel.findById(userId).exec();

        if (user.avatar) {
            try {
                fs.rmSync(path.join(avatarsRootDir, user.avatar));
            }catch (e) {}
        }

        const uuidAvatarName = `${v4()}${mimeToExtension[newAvatar.mimetype]}`;
        newAvatar.mv(path.join(avatarsRootDir, uuidAvatarName));

        user.avatar = uuidAvatarName;
        await user.save();
        return uuidAvatarName;
    }

    static async changePassword(userId, oldPassword, newPassword){
        const user = await UserModel.findById(userId).exec();
        if(!user){
            throw new UserNotFoundError("User not found");
        }
        const isPassValid = bcrypt.compareSync(oldPassword,user.password);
        if(!isPassValid){
            throw new OldPasswordDoNotMatch("Old password does not match the current one")
        }
        user.password = await bcrypt.hash(newPassword, 8);
        await user.save();
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