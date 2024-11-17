import fs from "node:fs";
import path from "node:path";
import {getBaseDirectory} from "../../app.js";

const baseDir = getBaseDirectory();

if (fs.existsSync(path.join(baseDir, 'test', 'temp'))) {
    console.debug("Cleanup performed")
    fs.rmSync(path.join(baseDir, 'test', 'temp'), {recursive: true})
}
