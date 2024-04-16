'use strict';

const assert = require('assert');
const mock = require('egg-mock');
const path = require('path');

describe('test/minio.test.js', () => {
    let app;
    before(() => {
        app = mock.app({
            baseDir: 'apps/minio',
        });
        return app.ready();
    });

    after(() => app.close());
    afterEach(mock.restore);

    it('upload file', async () => {
        let time = Date.now();
        const minio = app.minio.get('one');
        const bucketOne = await minio.$linkBucket('bucket-test');
        const result = await bucketOne.fPutObject(
            Date.now().toString(),
            path.join(__dirname, 'hello.txt')
        );
        console.log(result);
        const first = Date.now() - time;
        time = Date.now();
        const bucketTwo = await minio.$linkBucket('bucket-test');
        const result2 = await bucketTwo.fPutObject(
            Date.now().toString(),
            path.join(__dirname, 'hello.txt')
        );
        console.log(result2);
        const second = Date.now() - time;
        console.log(first, second);
        assert(second <= first);
    });
});
