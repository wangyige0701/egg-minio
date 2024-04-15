'use strict';

module.exports = agent => {
    if (agent.config.minio.agent) {
        require('./lib/minio')(agent);
    }
};
