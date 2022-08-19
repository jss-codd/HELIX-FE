#!/bin/sh
    git stash
    git pull 
    curl -o-   https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh    | bash
    . ~/.nvm/nvm.sh
    nvm install 10.21.0
    export NODE_OPTIONS=--max_old_space_size=8192
    ls
    npm install
    npm run start
    pm2 restart static-page-server-3010
    # pm2 save
    exit
EOF