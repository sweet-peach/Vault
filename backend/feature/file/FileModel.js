import {model, Schema, ObjectId} from 'mongoose';

const File = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    size: {type: Number, default: 0},
    path: {type: String, default: ''},
    url: {type: String},
    user: {type: ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now()},
    parent: {type: ObjectId, ref: 'File'},
    childs: [{type:ObjectId, ref: 'File'}]
})

export default model('File', File);

