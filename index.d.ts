import * as Minio from 'minio';

declare const rewriteFuncs: [
    // Bucket operations
    'bucketExists',
    'removeBucket',
    'listObjects',
    'listObjectsV2',
    'listIncompleteUploads',
    'getBucketVersioning',
    'setBucketVersioning',
    'setBucketReplication',
    'getBucketReplication',
    'removeBucketReplication',
    'setBucketTagging',
    'removeBucketTagging',
    'getBucketTagging',
    'setBucketLifecycle',
    'getBucketLifecycle',
    'removeBucketLifecycle',
    'setObjectLockConfig',
    'getObjectLockConfig',
    'setBucketEncryption',
    'getBucketEncryption',
    'removeBucketEncryption',
    // object operations
    'getObject',
    'getPartialObject',
    'fGetObject',
    'putObject',
    'fPutObject',
    'copyObject',
    'statObject',
    'removeObject',
    'removeObjects',
    'removeIncompleteUpload',
    'putObjectRetention',
    'getObjectRetention',
    'setObjectTagging',
    'removeObjectTagging',
    'getObjectTagging',
    'getObjectLegalHold',
    'setObjectLegalHold',
    'selectObjectContent',
    // Bucket Policy & Notification operations
    'getBucketNotification',
    'setBucketNotification',
    'removeAllBucketNotification',
    'listenBucketNotification',
    'getBucketPolicy',
    'setBucketPolicy',
];

type Ignore = Minio.NoResultCallback | ((error: Error | null, result: any) => void)

type RestParams<T extends any[]> = T extends [infer _, ...infer R] ? R : [];

type ReturnPromise<T extends any> = T extends Promise<any> ? T : Promise<T>

type PickArray<T extends any[]> = T extends [infer A, ...infer R] ? {
    [Key in A as Key]: (...args: RestParams<Parameters<Minio.Client[Key]>>) => ReturnPromise<ReturnType<Minio.Client[Key]>>;
} & PickArray<R> : {};

type OmitIgnore<T extends any[]> = {
    [Key in keyof T as Key]: Parameters<T[Key]> extends [...infer R, Ignore] ? (...args: R) => ReturnType<T[Key]> : T[Key];
}

type Rewrite = OmitIgnore<PickArray<typeof rewriteFuncs>>;

type MinioBuckets = Omit<Minio.Client, keyof Rewrite> & Rewrite

declare module 'egg' {
    type MinioClient = Minio.Client;
    type MinioOptions = Minio.ClientOptions;

    interface MinioClients {
        [key: string]: MinioClient;
    }

    type MinioSingleton = {
        clients: Map<string, MinioClient>;
        get (id: string): MinioClient;
    }

    interface Application {
        minio: MinioClient | MinioSingleton;
        minioBucket: MinioBuckets;
    }
    
    interface Context {
        minioBucket: MinioBuckets;
    }

    type MinioConfigOptions = MinioOptions & {
        buckets: string[]
    }

    interface EggAppConfig {
        minio: MinioConfigOptions & {
            client?: MinioConfigOptions;
            clients?: {
                [key: string]: MinioConfigOptions;
            };
        };
    }
}
