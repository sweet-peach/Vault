import bcrypt from "bcryptjs";
import InvalidCredentials from "./errors/InvalidCredentials.js";
import UserAlreadyExistsError from "./errors/UserAlreadyExistsError.js";
import jwt from "jsonwebtoken";
import UserModel from "../user/UserModel.js";
import FileService from "../file/FileService.js";
import config from "../../core/config.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION_IN_HOURS = config.jwt_expiration_in_hours | 24*30;
class AuthenticationService{
    static async login(email, password){
        const user = await UserModel.findOne({email: email}).exec();
        if(!user){
            throw new InvalidCredentials("Invalid user email or password");
        }

        const isPassValid = bcrypt.compareSync(password,user.password);
        if(!isPassValid){
            throw new InvalidCredentials("Invalid user email or password")
        }

        const token = jwt.sign({id: user.id},JWT_SECRET,{expiresIn: `${JWT_EXPIRATION_IN_HOURS}h`});

        return {
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            },
            jwt: token
        };
    }
    static async register(email, password){
        const candidate = await UserModel.findOne({email}).exec();
        if(candidate){
            throw new UserAlreadyExistsError(`User with email ${email} already exist`)
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const user = await new UserModel({email, password: hashPassword});
        await user.save();

        await FileService.createUserDirectory(user.id);

        const token = jwt.sign({id: user.id},JWT_SECRET,{expiresIn: `${JWT_EXPIRATION_IN_HOURS}h`});

        return {
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            },
            jwt: token
        };
    }
    static async checkToken(token){
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            throw new InvalidCredentials("Invalid JWT");
        }

        const user = await UserModel.findById(decoded.id).exec();
        if(!user){
            throw new InvalidCredentials("Invalid JWT");
        }
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
}

export default AuthenticationService;