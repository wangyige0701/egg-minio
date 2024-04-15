'use strict';

module.exports = app => {
    if (app.config.minio.app) {
        require('./lib/minio')(app);
    }
};
