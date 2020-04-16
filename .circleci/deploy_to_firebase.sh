#!/bin/bash

set -e
# set -x
set -o pipefail

function fail() {
  echo "$1"
  exit 1
}

APP_NAME="$1"
[ "$APP_NAME" == "" ] && fail "required: <APP_NAME> params"
[ "$FIREBASE_TOKEN" == "" ] && fail "required: <FIREBASE_TOKEN> params"

echo "install nodejs zip unzip"
curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs unzip zip
npm install yaml@1.8.3
npm install -g firebase-tools@7.16.2

FOLDER_PATH="apps/${APP_NAME}/"
echo "deploy_to_firebase.js"
node .circleci/deploy_to_firebase.js $APP_NAME $FOLDER_PATH
cd $FOLDER_PATH
echo "firebase deploy"
FIREBASE_PROJECT=applicaster-audience
firebase deploy --project applicaster-audience --token $FIREBASE_TOKEN
# firebase emulators:start --project applicaster-audience
