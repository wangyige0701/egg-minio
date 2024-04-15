'use strict';

exports.minio = {
    clients: {
        one: {
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            accessKey: '',
            secretKey: '',
            buckets: [ 'bucket-test' ],
        },
    },
};

exports.keys = '123456';
