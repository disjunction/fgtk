#!/bin/sh
export NODE_PATH=/usr/local/lib/node_modules:./src:./vendor:./tests

if [ -z $1 ]; then
        SPECS=tests/specs
else
        SPECS=$1
fi

jasmine-node --captureExceptions --verbose $SPECS
