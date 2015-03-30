#!/bin/sh
export NODE_PATH=$NODE_PATH:../src:../vendor:/usr/local/lib/node_modules

if [ -z $1 ]; then
        SPECS=specs
else
        SPECS=$1
fi

jasmine-node --captureExceptions --verbose $SPECS
