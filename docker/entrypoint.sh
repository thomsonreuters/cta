#!/bin/bash
set -e

rabbitmq-server &
mongod &
sleep 10
node /opt/cta/src/node_modules/cta-app-executiondataservice/lib/apps/main/app.js &
node /opt/cta/src/node_modules/cta-app-healthcheckdataservice/lib/apps/main/app.js &
node /opt/cta/src/node_modules/cta-app-instancedataservice/lib/apps/main/app.js &
node /opt/cta/src/node_modules/cta-app-jobmanagerdataservice/lib/apps/main/app.js &
node /opt/cta/src/node_modules/cta-app-notificationservice/lib/apps/main/app.js &
node /opt/cta/src/node_modules/cta-app-scenariodataservice/lib/apps/main/app.js &
node /opt/cta/src/node_modules/cta-app-schedulerdataservice/lib/apps/main/app.js &
node /opt/cta/src/node_modules/cta-app-agent/lib/apps/main/app.js