import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;

try {
    await mongoose.connect(process.env.MONGODB_URL);

    app.listen(PORT, ()=>{
        console.log(`Server started listening on port: ${PORT}`)
    })
} catch (e) {
    console.log(e);
    process.exit(1);
}

export default app
