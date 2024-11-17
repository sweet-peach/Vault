import {before} from "mocha";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
export default function baseConfigurationWrapper(fn) {
    return ()=>{
        let mongoServer;
        before(async () => {
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
        });
        after(async () => {
            await mongoose.disconnect();
            await mongoServer.stop();
        });
        fn()
    }
}