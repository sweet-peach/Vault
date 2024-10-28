import UserAlreadyExistsError from "../../feature/authentication/errors/UserAlreadyExistsError.js";
import InvalidCredentials from "../../feature/authentication/errors/InvalidCredentials.js";
import NoSpaceOnDiskError from "../../feature/file/errors/NoSpaceOnDiskError.js";
import FileAlreadyExists from "../../feature/file/errors/FileAlreadyExists.js";
import NoFileProvided from "../../feature/file/errors/NoFileProvided.js";

export function errorHandler(err, req, res, next) {
    if (err instanceof UserAlreadyExistsError) {
        return res.status(err.status).json({ message: err.message });
    }

    if (err instanceof InvalidCredentials) {
        return res.status(err.status).json({ message: err.message });
    }

    if (err instanceof NoSpaceOnDiskError) {
        return res.status(err.status).json({ message: err.message });
    }

    if (err instanceof FileAlreadyExists) {
        return res.status(err.status).json({ message: err.message });
    }

    if (err instanceof NoFileProvided) {
        return res.status(err.status).json({ message: err.message });
    }

    console.error("Unhandled error");
    console.error(err);

    return res.status(500).json({ message: "Internal server error" });
}
