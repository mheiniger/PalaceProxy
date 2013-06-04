#!/bin/bash

if which nodejs >/dev/null; then
    nodejs app.js
fi

if which node >/dev/null; then
    node app.js
fi
