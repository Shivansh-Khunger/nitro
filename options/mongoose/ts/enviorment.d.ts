declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            MONGO_URI: string;
        }
    }
}

export type {};
