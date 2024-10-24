#!/bin/bash

# Run npm build:dev
npm run build:dev

# Copy the build directory to the remote server
scp -r build/* root@149.28.69.114:/var/www/html