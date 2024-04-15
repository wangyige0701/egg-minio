import * as Minio from 'minio';

type MinioClient = Minio.Client;

type MinioClientOptions = Minio.ClientOptions;

declare module 'egg' {
    type ClientWithBucket<T extends string> = MinioClient & {
        $linkBucket: (bucketName: T) => MinioBucketClient;
        $bucket: {
            [key in T as key]: MinioBucketClient;
        }
    };

    type MinioSingleton<T extends string> = {
        clients: Map<string, ClientWithBucket<T>>;
        get (id: string): ClientWithBucket<T>;
    }

    interface Application {
        minio: ClientWithBucket | MinioSingleton;
    }
    
    interface Context {
        minio: Application['minio'];
    }

    type MinioConfigOptions = MinioClientOptions & {
        buckets: string[] | readonly string[];
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

class MinioBucketClient extends Minio.Client {
    removeBucket(): Promise<void>;
    /**
     * Stat information of the object.
     */
    statObject(objectName: string, statOpts?: StatObjectOpts): Promise<BucketItemStat>;
    removeObject(objectName: string, removeOpts?: RemoveOptions): Promise<void>;
    removeBucketReplication(): Promise<void>;
    removeBucketReplication(callback: NoResultCallback): void;
    setBucketReplication(replicationConfig: ReplicationConfigOpts, callback: NoResultCallback): void;
    setBucketReplication(replicationConfig: ReplicationConfigOpts): Promise<void>;
    getBucketReplication(callback: ResultCallback<ReplicationConfig>): void;
    getBucketReplication(): Promise<ReplicationConfig>;

    // Bucket operations
    bucketExists(callback: ResultCallback<boolean>): void;
    bucketExists(): Promise<boolean>;
    listObjects(prefix?: string, recursive?: boolean): BucketStream<BucketItem>;
    listObjectsV2(prefix?: string, recursive?: boolean, startAfter?: string): BucketStream<BucketItem>;
    listIncompleteUploads(prefix?: string, recursive?: boolean): BucketStream<IncompleteUploadedBucketItem>;
    getBucketVersioning(callback: ResultCallback<VersioningConfig>): void;
    getBucketVersioning(): Promise<VersioningConfig>;
    setBucketVersioning(versioningConfig: any, callback: NoResultCallback): void;
    setBucketVersioning(versioningConfig: any): Promise<void>;
    getBucketTagging(callback: ResultCallback<Tag[]>): void;
    getBucketTagging(): Promise<Tag[]>;
    setBucketTagging(tags: TagList, callback: NoResultCallback): void;
    setBucketTagging(tags: TagList): Promise<void>;
    removeBucketTagging(callback: NoResultCallback): void;
    removeBucketTagging(): Promise<void>;
    setBucketLifecycle(lifecycleConfig: Lifecycle, callback: NoResultCallback): void;
    setBucketLifecycle(lifecycleConfig: Lifecycle): Promise<void>;
    getBucketLifecycle(callback: ResultCallback<Lifecycle>): void;
    getBucketLifecycle(): Promise<Lifecycle>;
    removeBucketLifecycle(callback: NoResultCallback): void;
    removeBucketLifecycle(): Promise<void>;
    setObjectLockConfig(callback: NoResultCallback): void;
    setObjectLockConfig(lockConfig: Lock, callback: NoResultCallback): void;
    setObjectLockConfig(lockConfig?: Lock): Promise<void>;
    getObjectLockConfig(callback: ResultCallback<Lock>): void;
    getObjectLockConfig(): Promise<Lock>;
    getBucketEncryption(callback: ResultCallback<Encryption>): void;
    getBucketEncryption(): Promise<Encryption>;
    setBucketEncryption(encryptionConfig: Encryption, callback: NoResultCallback): void;
    setBucketEncryption(encryptionConfig: Encryption): Promise<void>;
    removeBucketEncryption(callback: NoResultCallback): void;
    removeBucketEncryption(): Promise<void>;

    // Object operations
    getObject(objectName: string, callback: ResultCallback<ReadableStream>): void;
    getObject(objectName: string): Promise<ReadableStream>;
    getPartialObject(objectName: string, offset: number, callback: ResultCallback<ReadableStream>): void;
    getPartialObject(objectName: string, offset: number, length: number, callback: ResultCallback<ReadableStream>): void;
    getPartialObject(objectName: string, offset: number, length?: number): Promise<ReadableStream>;
    fGetObject(objectName: string, filePath: string, callback: NoResultCallback): void;
    fGetObject(objectName: string, filePath: string): Promise<void>;
    putObject(objectName: string, stream: ReadableStream | Buffer | string, callback: ResultCallback<UploadedObjectInfo>): void;
    putObject(objectName: string, stream: ReadableStream | Buffer | string, size: number, callback: ResultCallback<UploadedObjectInfo>): void;
    putObject(objectName: string, stream: ReadableStream | Buffer | string, size: number, metaData: ItemBucketMetadata, callback: ResultCallback<UploadedObjectInfo>): void;
    putObject(objectName: string, stream: ReadableStream | Buffer | string, size?: number, metaData?: ItemBucketMetadata): Promise<UploadedObjectInfo>;
    putObject(objectName: string, stream: ReadableStream | Buffer | string, metaData?: ItemBucketMetadata): Promise<UploadedObjectInfo>;
    fPutObject(objectName: string, filePath: string, metaData: ItemBucketMetadata, callback: ResultCallback<UploadedObjectInfo>): void;
    fPutObject(objectName: string, filePath: string, metaData?: ItemBucketMetadata): Promise<UploadedObjectInfo>;
    copyObject(objectName: string, sourceObject: string, conditions: CopyConditions, callback: ResultCallback<BucketItemCopy>): void;
    copyObject(objectName: string, sourceObject: string, conditions: CopyConditions): Promise<BucketItemCopy>;
    removeObjects(objectsList: string[], callback: NoResultCallback): void;
    removeObjects(objectsList: string[]): Promise<void>;
    removeIncompleteUpload(objectName: string, callback: NoResultCallback): void;
    removeIncompleteUpload(objectName: string): Promise<void>;
    putObjectRetention(objectName: string, callback: NoResultCallback): void;
    putObjectRetention(objectName: string, retentionOptions: Retention, callback: NoResultCallback): void;
    putObjectRetention(objectName: string, retentionOptions?: Retention): Promise<void>;
    getObjectRetention(objectName: string, options: VersionIdentificator, callback: ResultCallback<Retention>): void;
    getObjectRetention(objectName: string, options: VersionIdentificator): Promise<Retention>;
    setObjectTagging(objectName: string, tags: TagList, callback: NoResultCallback): void;
    setObjectTagging(objectName: string, tags: TagList, putOptions: VersionIdentificator, callback: NoResultCallback): void;
    setObjectTagging(objectName: string, tags: TagList, putOptions?: VersionIdentificator): Promise<void>;
    removeObjectTagging(objectName: string, callback: NoResultCallback): void;
    removeObjectTagging(objectName: string, removeOptions: VersionIdentificator, callback: NoResultCallback): void;
    removeObjectTagging(objectName: string, removeOptions?: VersionIdentificator): Promise<void>;
    getObjectTagging(objectName: string, callback: ResultCallback<Tag[]>): void;
    getObjectTagging(objectName: string, getOptions: VersionIdentificator, callback: ResultCallback<Tag[]>): void;
    getObjectTagging(objectName: string, getOptions?: VersionIdentificator): Promise<Tag[]>;
    getObjectLegalHold(objectName: string, callback: ResultCallback<LegalHoldOptions>): void;
    getObjectLegalHold(objectName: string, getOptions: VersionIdentificator, callback: ResultCallback<LegalHoldOptions>): void;
    getObjectLegalHold(objectName: string, getOptions?: VersionIdentificator): Promise<LegalHoldOptions>;
    setObjectLegalHold(objectName: string, callback: NoResultCallback): void;
    setObjectLegalHold(objectName: string, setOptions: LegalHoldOptions, callback: NoResultCallback): void;
    setObjectLegalHold(objectName: string, setOptions?: LegalHoldOptions): Promise<void>;
    selectObjectContent(objectName: string, selectOpts: SelectOptions, callback: NoResultCallback): void;
    selectObjectContent(objectName: string, selectOpts: SelectOptions): Promise<void>;

    // Bucket Policy & Notification operations
    getBucketNotification(callback: ResultCallback<NotificationConfig>): void;
    getBucketNotification(): Promise<NotificationConfig>;
    setBucketNotification(bucketNotificationConfig: NotificationConfig, callback: NoResultCallback): void;
    setBucketNotification(bucketNotificationConfig: NotificationConfig): Promise<void>;
    removeAllBucketNotification(callback: NoResultCallback): void;
    removeAllBucketNotification(): Promise<void>;
    getBucketPolicy(callback: ResultCallback<string>): void;
    getBucketPolicy(): Promise<string>;
    setBucketPolicy(bucketPolicy: string, callback: NoResultCallback): void;
    setBucketPolicy(bucketPolicy: string): Promise<void>;
    listenBucketNotification(prefix: string, suffix: string, events: NotificationEvent[]): NotificationPoller;
}
