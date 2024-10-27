class UserAlreadyExistsError extends Error {
    constructor(message) {
        super();
        this.status = 409;
        this.message = message;
    }
}

export default UserAlreadyExistsError;
