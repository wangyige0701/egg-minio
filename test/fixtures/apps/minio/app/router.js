'use strict';

module.exports = app => {
    const { router, controller } = app;

    router.post('/upload', controller.upload.index);
};
