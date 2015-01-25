#!/bin/sh
export NODE_PATH=/usr/local/lib/node_modules:./src:./vendor
jasmine-node --captureExceptions --verbose tests/specs
