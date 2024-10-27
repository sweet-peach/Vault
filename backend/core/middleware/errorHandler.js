import UserAlreadyExistsError from "../../feature/authentication/errors/UserAlreadyExistsError.js";
import InvalidCredentials from "../../feature/authentication/errors/InvalidCredentials.js";

export function errorHandler(err, req, res, next) {
    if (err instanceof UserAlreadyExistsError) {
        return res.status(err.status).json({ message: err.message });
    }

    if (err instanceof InvalidCredentials) {
        return res.status(err.status).json({ message: err.message });
    }

    console.error("Unhandled error");
    console.error(err);

    return res.status(500).json({ message: "Internal server error" });
}
