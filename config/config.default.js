'use strict';

/**
 * egg-minio default config
 * @member Config#minio
 * @property {String} endPoint - Hostname of the object storage service.
 * @property {Number} port - TCP/IP port number. Optional, defaults to 80 for HTTP and 443 for HTTPs.
 * @property {String} accessKey - Access key (user ID) of an account in the S3 service.
 * @property {String} secretKey - Secret key (password) of an account in the S3 service.
 * @property {Boolean} useSSL - Optional, set to 'true' to enable secure (HTTPS) access.
 * @property {String[]} buckets - Initialization some bucket names.
 */
exports.minio = {
    endPoint: '',
    port: 80,
    useSSL: false,
    accessKey: '',
    secretKey: '',
    buckets: [],
    app: true,
    agent: false,
};

exports.multipart = {
    mode: 'file',
};
