module.exports = Object.freeze({
    AUTH_URL: process.env.AUTH_URL || "https://auth-wallet.upbond.io",
    WEBHOOK_URL: process.env.WEBHOOK_URL || "https://sample-userinfo.upbond.io/webhook",
    DATABASE_URL: process.env.DATABASE_URL,
    SOURCE_DATABASE_URL: process.env.SOURCE_DATABASE_URL,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    EVENT_TYPE: {
        CREATE_USER: 'create-user',
        DELETE_USER: 'delete-user',
        GET_USER: 'get-user'
    },
    EVENT_STATUS: {
        QUEUE: 'queue',
        ON_PROCESS: 'on-process',
        SUCCESS: 'success',
        FAILED: 'failed'
    }
});