#!/bin/sh
export NODE_PATH=/usr/local/lib/node_modules:./src:./vendor:./tests:../dispace-libs:./node_modules

if [ -z $1 ]; then
        SPECS=tests/specs
else
        SPECS=$1
fi

node_modules/jasmine-node/bin/jasmine-node --captureExceptions --verbose $SPECS
