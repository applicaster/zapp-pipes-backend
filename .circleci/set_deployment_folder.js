const YAML = require('yaml')
const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var args = process.argv.slice(2);
const APP_NAME = args[0];
const ZIP_FOLDER_PATH = args[1];

run(APP_NAME,ZIP_FOLDER_PATH);

function run(app_name,zip_folder_path){
    try{
        const appFolder = `apps/${app_name}/`;
        console.log("getConfig")
        const config = getConfig(appFolder);
        syncWorkflow(config,appFolder)
    }
    catch(ex){
        console.log("ERROR",ex);
    }
}
async function syncWorkflow(config,folder,zip_folder_path){
    await installNPM(folder,config.app.npm_packages,config.app.npm_version)
    console.log("createZipFile")
    await createZipFile(folder, config.app.npm_packages);
    console.log("deployToServer")
    await deployToServer(folder,config.app.deploy,zip_folder_path);
}
async function deployToServer(folder,zip_folder_path){
    console.log(`delete folder /tmp/${folder}`)
    await exec(`rm -rf /tmp/${folder}`);
    console.log(`mkdir folder /tmp/${folder}`)
    await exec(`mkdir -p /tmp/${folder}`);
    console.log(`unzip to /tmp/`);
    await exec(`cd ./${folder} && unzip server.zip -d /tmp/${folder} > /tmp/null`);
    await exec(`cd ./${folder} && npm i`);
    await exec(`cd ./${folder} && cp cloudbuild.json  /tmp/${folder}`);
    await exec(`cd ./${folder} && cp package-lock.json  /tmp/${folder}`);
    await exec(`cd ./${folder} && cp Dockerfile  /tmp/${folder}`);
    await exec(`cd ./${folder} && cp firebase.json  /tmp/${folder}`);

    // console.log(`gcloud builds`)
    // await exec(`cd /tmp/${folder} && gcloud builds submit --config cloudbuild.json ./`);


    // cp ./apps/app_name1/cloudbuild.json ./apps/app_name1/node_modules/@applicaster/zapp-pipes-provider-mpx/
    // cp ./apps/app_name1/Dockerfile ./apps/app_name1/node_modules/@applicaster/zapp-pipes-provider-mpx/
    // cd ./apps/app_name1/node_modules/@applicaster/zapp-pipes-provider-mpx/
    // gcloud builds submit --config cloudbuild.json ./
}

async function createZipFile(folder,packages_name){
    console.log("ziping...")
    await exec(`cd ./${folder}node_modules/${packages_name}/ && zip -r server.zip . > /tmp/null`);
    await exec(`cp ./${folder}node_modules/${packages_name}/server.zip ${folder}`);
}

async function installNPM(folder,packages_name,package_version){
    await exec(`rm -rf ./${folder}node_modules/`);
    await exec(`npm i --prefix ${folder} ${packages_name}@${package_version}`);
    await exec(`cp ./${folder}.babelrc ./${folder}node_modules/${packages_name}/`);
    await exec(`cp ./${folder}/.npmrc ./${folder}node_modules/${packages_name}/`);
    console.log(`npm --prefix ./${folder}node_modules/${packages_name} install`)
    // await exec(`npm --prefix ./${folder}node_modules/${packages_name} install`);

    // this lines is only for test/run-local
    //console.log("node starting at localhost:8080")
    //await exec(`npm --prefix ./${folder}node_modules/${packages_name}/ start`);
}

function getConfig(folderPath){
    var config_path = `${folderPath}app_config.yaml`
    const yaml_file = fs.readFileSync(config_path, 'utf8')
    return YAML.parse(yaml_file);
}
