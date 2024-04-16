/// <reference types="../../../../index.d.ts" />

declare module 'egg' {
    interface Application {
        minio: MinioSingleton
    }
}