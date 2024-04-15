const assert = require('assert');
const Minio = require('minio');

const globalBucketNames = [];

/**
 * minio
 * @param {import('egg').Application} app application
 */
module.exports = app => {
    const { client, clients, endPoint, port, useSSL, accessKey, secretKey, region, transport, sessionToken, partSize, pathStyle, credentialsProvider, s3AccelerateEndpoint, transportAgent, buckets } = app.config.minio;
    if (!client && !clients) {
        app.config.minio.client = {
            endPoint,
            port,
            useSSL,
            accessKey,
            secretKey,
            region,
            transport,
            sessionToken,
            partSize,
            pathStyle,
            credentialsProvider,
            s3AccelerateEndpoint,
            transportAgent,
        };
    }
    if (buckets && Array.isArray(buckets)) {
        globalBucketNames.push(...buckets);
    }
    app.addSingleton('minio', createClient);
};

const rewriteFuncs = [
    // Bucket operations
    'bucketExists',
    'removeBucket',
    'listObjects',
    'listObjectsV2',
    'listObjectsV2WithMetadata',
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

async function createClient(config, app) {
    const { endPoint, port, useSSL = false, accessKey, secretKey, region, transport, sessionToken, partSize, pathStyle, credentialsProvider, s3AccelerateEndpoint, transportAgent, buckets } = config;
    assert(endPoint && accessKey && secretKey, '\"endPoint\",\"accessKey\",\"secretKey\" is necessary');

    /** @type {Minio.Client} */
    let minioClient;
    try {
        minioClient = new Minio.Client({
            endPoint,
            port,
            useSSL,
            accessKey,
            secretKey,
            region,
            transport,
            sessionToken,
            partSize,
            pathStyle,
            credentialsProvider,
            s3AccelerateEndpoint,
            transportAgent,
        });
        minioClient.$linkBucket = async function(bucketName) {
            if (typeof bucketName !== 'string') {
                throw new Error(`Invalid bucket name: ${bucketName}`);
            }
            await makeBucket(app, minioClient, bucketName);
            const result = Object.create(minioClient);
            rewriteFuncs.forEach(func => {
                if (func in minioClient && typeof minioClient[func] === 'function') {
                    result[func] = (...args) => {
                        return minioClient[func](bucketName, ...args);
                    };
                } else {
                    throw new Error(`function named ${func} is not exist in Minio.Client`);
                }
            });
            return result;
        };
        const bucketArray = (Array.isArray(buckets) ? buckets : []).concat(globalBucketNames);
        for (let i = 0; i < bucketArray.length; i++) {
            const bucket = bucketArray[i];
            await bindBucket(app, bucket, minioClient.$linkBucket);
        }
        app.coreLogger.info('[egg-minio] connected in %s:%s', endPoint, port);
    } catch (error) {
        app.coreLogger.error('[egg-minio] error in %s:%s %s', endPoint, port, error);
    }

    return minioClient;
}

/**
 * 创建桶
 * @param {import('egg').Application} app application对象
 * @param {Minio.Client} client minio客户端
 * @param {string} bucketName 桶名
 */
async function makeBucket(app, client, bucketName) {
    try {
        if (!await client.bucketExists(bucketName)) {
            await client.makeBucket(bucketName);
            app.coreLogger.info(`[egg-minio] bucket [${bucketName}] created success`);
        }
    } catch (error) {
        app.coreLogger.error(`[egg-minio] get bucket [${bucketName}] error: %s`, error);
    }
}

/**
 * 绑定桶名
 * @param {import('egg').Application} app app
 * @param {string} bucketName bucket name
 * @param {(bucketName: string) => any} linkBucket linkBucket
 */
async function bindBucket(app, bucketName, linkBucket) {
    if (bucketName) {
        if (!app.minioBucket) {
            app.minioBucket = {};
        }
        app.minioBucket[bucketName] = await linkBucket(bucketName);
    }
}
