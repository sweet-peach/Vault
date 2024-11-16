import FileModel from "./FileModel.js";
import path from "node:path";
import * as fs from "node:fs";
import UserModel from "../user/UserModel.js";
import NoSpaceOnDiskError from "./errors/NoSpaceOnDiskError.js";
import FileAlreadyExists from "./errors/FileAlreadyExists.js";
import FileNotFoundError from "./errors/FileNotFoundError.js";
import config from "../../core/config.js";
import UserNotFoundError from "../user/errors/UserNotFoundError.js";
import {getBaseDirectory} from "../../app.js";

const baseDir = getBaseDirectory();
const filesRootDir = config.files_directory || path.join(baseDir, 'files');

// TODO implement transactions

if (!fs.existsSync(filesRootDir)) {
    fs.mkdirSync(filesRootDir, { recursive: true });
}

function filesToDTO(files){
    const dataTransferObjects = []
    for(const file of files){
        dataTransferObjects.push(fileToDTO(file))
    }
    return dataTransferObjects
}

function fileToDTO(file){
    return {
        id: file._id,
        name: file.name,
        type: file.type,
        date: file.date,
        size: file.size
    }
}

class FileService {
    static async createUserDirectory(userId) {
        const userDirPath = path.join(filesRootDir, userId);
        fs.mkdirSync(userDirPath);
    }

    // TODO remake
    static async deleteFile(fileId, ownerId){
        const user = await UserModel.findById(ownerId).exec();
        if(!user){
            throw new UserNotFoundError("File owner not found");
        }
        const file = await FileModel.findOne({
            user: ownerId,
            _id: fileId
        }).exec();
        if(!file) return;
        const children = file.childs;
        for(const child of children){
            await this.deleteFile(child._id, ownerId);
        }
        if (file.type === 'dir') {
            await fs.rmdirSync(this.getFilePath(file));
        } else {
            await fs.unlinkSync(this.getFilePath(file));
        }
        user.usedSpace = user.usedSpace - file.size;
        await user.save();
        await FileModel.findByIdAndDelete(fileId);
    }

    // TODO make possible creation of two folders with identical names
    static async createDirectory(directoryName, ownerUserId, parentDirectoryId) {
        const candidate = await FileModel.findOne({
            name: directoryName,
            type: "dir",
            parent: parentDirectoryId,
            user: ownerUserId
        }).exec();

        if(candidate){
            return fileToDTO(candidate);
        }

        const newDirectory = new FileModel({
            name: directoryName,
            type: "dir",
            parent: parentDirectoryId,
            user: ownerUserId
        });

        const parentDirectory = parentDirectoryId ? await FileModel.findById(parentDirectoryId).exec() : null;
        let serverPath = path.join(filesRootDir,ownerUserId);

        if (parentDirectory) {
            serverPath = path.join(serverPath, parentDirectory.path, directoryName);
            newDirectory.path = path.join(parentDirectory.path, directoryName);
            parentDirectory.childs.push(newDirectory._id);
            await parentDirectory.save();
        } else {
            serverPath = path.join(serverPath, directoryName);
            newDirectory.path = directoryName;
        }

        fs.mkdirSync(serverPath);

        await newDirectory.save();
        return fileToDTO(newDirectory);
    }

    static async listDirectory(directoryId, userId, sort) {
        let files

        switch (sort) {
            case 'name':
                files = await FileModel.find({user: userId, parent: directoryId}).sort({name: 1}).exec();
                break
            case 'type':
                files = await FileModel.find({user: userId, parent: directoryId}).sort({type: 1}).exec();
                break;
            case 'date':
                files = await FileModel.find({user: userId, parent: directoryId}).sort({date: 1}).exec();
                break;
            default:
                files = await FileModel.find({user: userId, parent: directoryId}).exec();
        }

        return filesToDTO(files);
    }
    static async uploadFile(file,userId, directoryId) {
        const parentDirectory = directoryId ? await FileModel.findOne({user: userId, _id: directoryId}).exec() : null;
        const user = await UserModel.findOne({_id: userId}).exec();

        if (user.usedSpace + file.size > user.diskSpace) {
            throw new NoSpaceOnDiskError("No more space on disk")
        }

        let filePath;
        if(parentDirectory){
            filePath = path.join(parentDirectory.path,file.name) ;
        } else {
            filePath = `${file.name}`;
        }

        const absoluteFilePath =  path.join(filesRootDir,user.id,filePath);
        if (fs.existsSync(absoluteFilePath)) {
            throw new FileAlreadyExists(`File ${file.name} already exists`)
        }

        user.usedSpace += file.size;

        file.mv(absoluteFilePath);

        const type = file.name.split('.').pop();

        const createdFile = new FileModel({
            name: file.name,
            type: type,
            size: file.size,
            path: filePath.toString(),
            parent: directoryId,
            user: userId
        })
        await createdFile.save();
        if(parentDirectory) {
            parentDirectory.childs.push(createdFile._id)
            await parentDirectory.save();
        }
        await user.save();

        return fileToDTO(createdFile);
    }
    static async getFile(fileId, ownerId, dto = true) {
        const file = await FileModel.findOne({user: ownerId, _id: fileId}).exec();
        if(!file){
            throw new FileNotFoundError("File not found");
        }
        if(dto){
            return fileToDTO(file);
        } else {
            return file;
        }
    }

    static async getFilesByName(searchName, ownerId) {
        let files = await FileModel.find({user: ownerId}).exec();
        files = files.filter(file => file.name.includes(searchName));

        return filesToDTO(files);
    }
    static getFilePath(file) {
        return path.join(filesRootDir,file.user.toString(),file.path);
    }
    static async searchFile() {}
}

export default FileService;
