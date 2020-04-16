#!/bin/bash

set -e
set -x
set -o pipefail

# cloudbuild.yaml build and deploy to cloud run
cp ./apps/app_name1/cloudbuild.json ./apps/app_name1/node_modules/@applicaster/zapp-pipes-provider-mpx/
cp ./apps/app_name1/Dockerfile ./apps/app_name1/node_modules/@applicaster/zapp-pipes-provider-mpx/
cd ./apps/app_name1/node_modules/@applicaster/zapp-pipes-provider-mpx/
gcloud builds submit --config cloudbuild.json ./

#  set firebase CDN
