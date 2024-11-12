class UserNotFoundError extends Error {
    constructor(message) {
        super();
        this.status = 404;
        this.message = message;
    }
}

export default UserNotFoundError;