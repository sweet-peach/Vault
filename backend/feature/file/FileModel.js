import {model, Schema, Types} from 'mongoose';

const FileSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    size: {type: Number, default: 0},
    path: {type: String, default: ''},
    url: {type: String},
    user: {type: Types.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now()},
    parent: {type: Types.ObjectId, ref: 'File'},
    childs: [{type:Types.ObjectId, ref: 'File'}]
})

const FileModel = model('File',FileSchema)

export default FileModel

