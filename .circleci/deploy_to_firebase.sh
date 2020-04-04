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

# [ "$GOOGLE_ACCOUNT_SERVICE_EMAIL" == "" ] && fail "required: <GOOGLE_ACCOUNT_SERVICE> params"
# [ "$GOOGLE_PROJECT" == "" ] && fail "required: <GOOGLE_PROJECT> params"
# [ "$GOOGLE_APPS_SERVICE_JSON" == "" ] && fail "required: <GOOGLE_APPS_SERVICE_JSON> params"
[ "$FIREBASE_TOKEN" == "" ] && fail "required: <FIREBASE_TOKEN> params"

mkdir -p ~/.googlecloud
# write service account access params
# cat <<EOF > ~/.googlecloud/$GOOGLE_PROJECT
# ${GOOGLE_APPS_SERVICE_JSON}
# EOF
# cat ~/.googlecloud/$GOOGLE_PROJECT
# echo "GOOGLE_ACCOUNT_SERVICE_EMAIL $GOOGLE_ACCOUNT_SERVICE_EMAIL"
# echo "GOOGLE_PROJECT $GOOGLE_PROJECT"
# echo "gcloud login"
# gcloud auth activate-service-account $GOOGLE_ACCOUNT_SERVICE_EMAIL --key-file=$HOME/.googlecloud/$GOOGLE_PROJECT --project $GOOGLE_PROJECT
echo "install nodejs zip unzip"
# curl -sL https://deb.nodesource.com/setup_12.x | bash -
# apt-get install -y nodejs unzip zip
# npm install yaml@1.8.3
# npm install -g firebase-tools@7.16.2

FOLDER_PATH="/tmp/apps/${APP_NAME}"
echo "deploy_to_firebase.js"
node .circleci/deploy_to_firebase.js $APP_NAME $FOLDER_PATH

echo "cd to: $FOLDER_PATH"
cd $FOLDER_PATH
echo "gcloud builds submit"
# gcloud builds submit --config cloudbuild.json ./
echo "firebase deploy"
FIREBASE_PROJECT=applicaster-audience

firebase deploy --project $FIREBASE_PROJECT --token $FIREBASE_TOKEN
firebase emulators:start --project applicaster-audience
# echo "Hosting Domain: $FIREBASE_PROJECT.firebaseapp.com"
