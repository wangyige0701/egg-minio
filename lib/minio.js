const assert = require('assert');
const Minio = require('minio');

/** @type {string[]} */
const globalBucketNames = [];
/** @type {import('./minio').MinioClientWeakMap} */
const minioClientMap = new WeakMap();

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
                throw new Error(`[egg-minio] Invalid bucket name: ${bucketName}`);
            }
            await makeBucket(app, minioClient, bucketName);
            /** @type {Map<string, any>} */
            let cacheMap = minioClientMap.get(minioClient);
            if (cacheMap && cacheMap.has(bucketName)) {
                return cacheMap.get(bucketName);
            } else if (!cacheMap) {
                cacheMap = new Map();
                minioClientMap.set(minioClient, cacheMap);
            }
            const result = Object.create(minioClient);
            const proxy = new Proxy(result, {
                get(target, property) {
                    if (rewriteFuncs.includes(property) && typeof target[property] === 'function') {
                        return (...args) => {
                            return target[property](bucketName, ...args);
                        };
                    }
                    return target[property];
                },
            });
            cacheMap.set(bucketName, proxy);
            return proxy;
        };
        // 在客户端对象上绑定桶操作代理对象
        const bucketArray = (Array.isArray(buckets) ? buckets : []).concat(globalBucketNames);
        for (let i = 0; i < bucketArray.length; i++) {
            const bucket = bucketArray[i];
            const result = await minioClient.$linkBucket(bucket);
            bindBucket(minioClient, '$bucket', bucket, result);
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
        app.coreLogger.error(`[egg-minio] get/created bucket [${bucketName}] error: %s`, error);
    }
}

/**
 * 绑定桶名
 * @param {object} object object
 * @param {string} property 挂载的属性名
 * @param {string} bucketName bucket name
 * @param {any} result result
 */
function bindBucket(object, property, bucketName, result) {
    if (bucketName) {
        if (!object[property]) {
            object[property] = {};
        }
        object[property][bucketName] = result;
    }
}
