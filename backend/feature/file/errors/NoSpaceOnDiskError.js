class NoSpaceOnDiskError extends Error {
    constructor(message) {
        super();
        this.status = 507;
        this.message = message;
    }
}

export default NoSpaceOnDiskError;
