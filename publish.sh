#!/bin/sh

if [ -x "$(command -v zip)" ]; then
    cd src
    zip ../moodle-helper.zip background.js content.js manifest.json popup.*
else
    echo "You need to install zip."
fi