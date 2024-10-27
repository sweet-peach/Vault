import express from "express";
import mongoose from "mongoose";
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(express.json());


const start = async () => {
    try {
        await mongoose.connect(MONGODB_URL);

        app.listen(PORT, ()=>{
            console.log(`Server started listening on port: ${PORT}`)
        })
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

start();