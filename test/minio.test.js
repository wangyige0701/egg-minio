'use strict';

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
        const minio = app.minio.get('one');
        const buckets = minio.$bucket;
        const result = await buckets['bucket-test'].fPutObject(
            Date.now().toString() + '.txt',
            path.join(__dirname, 'hello.txt')
        );
        console.log(result);
        // app.httpRequest()
        //     .post('/upload')
        //     .attach('file', 'hello.txt')
        //     .expect(200)
        //     .then(response => {
        //         console.log(response);
        //     });
    });
});
