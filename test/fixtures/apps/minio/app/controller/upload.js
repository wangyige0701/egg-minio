'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');

class HomeController extends Controller {
    async index() {
        const ctx = this.ctx;
        const file = ctx.request.files[0];
        const minio = ctx.minio.get('one');
        const buckets = minio.$bucket;
        const sufix = path.basename(file.filename);
        const fileName = Date.now().toString() + sufix;
        let result;
        try {
            result = await buckets['bucket-test'].fPutObject(fileName, fileName, file.filepath);
        } finally {
            await fs.promises.unlink(file.filepath);
        }
        this.ctx.body = result;
    }
}

module.exports = HomeController;
