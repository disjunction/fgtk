#!/bin/sh
export NODE_PATH=../src

if [ -z $1 ]; then
        SPECS=specs
else
        SPECS=$1
fi

jasmine-node --captureExceptions --verbose $SPECS
