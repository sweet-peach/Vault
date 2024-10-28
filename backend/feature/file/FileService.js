import FileModel from "./FileModel.js";
import { getBaseDirectory } from "../../index.js";
import path from "node:path";
import * as fs from "node:fs";

const baseDir = getBaseDirectory();
const filesRootDir = process.env.FILES_DIRECTORY || path.join(baseDir, 'files');

if (!fs.existsSync(filesRootDir)) {
    fs.mkdirSync(filesRootDir, { recursive: true });
}

class FileService {
    static async createUserDirectory(userId) {
        const userDirPath = path.join(filesRootDir, userId);
        fs.mkdirSync(userDirPath);
    }

    static async createDirectory(directoryName, ownerUserId, parentDirectoryId) {

        const candidate = await FileModel.findOne({
            name: directoryName,
            type: "dir",
            parent: parentDirectoryId
        }).exec();

        if(candidate){
            return candidate;
        }

        const newDirectory = new FileModel({
            name: directoryName,
            type: "dir",
            parent: parentDirectoryId,
            user: ownerUserId
        });

        const parentDirectory = parentDirectoryId ? await FileModel.findById(parentDirectoryId).exec() : null;

        if (parentDirectory) {
            newDirectory.path = `${parentDirectory.path}\\${newDirectory.name}`;
            parentDirectory.childs.push(newDirectory._id);
            await parentDirectory.save();
        } else {
            newDirectory.path = directoryName;
        }

        fs.mkdirSync(newDirectory.path);

        await newDirectory.save();
        return newDirectory;
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

        return files;
    }
    static async uploadFile() {}
    static async downloadFile() {}
    static async searchFile() {}
}

export default FileService;
