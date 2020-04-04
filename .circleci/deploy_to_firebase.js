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
        console.log("syncWorkflow")
        syncWorkflow(config,appFolder)
    }
    catch(ex){
        console.log("ERROR",ex);
    }
}
async function syncWorkflow(config,folder,zip_folder_path){
    console.log("installNPM")
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
    await exec(`mkdir -p /tmp/${folder}/functionsES6/`);
    console.log(`unzip to /tmp/`);
    await exec(`cd ./${folder} && unzip server.zip -d /tmp/${folder}/functionsES6/ > /tmp/null`);
    await exec(`cd ./${folder} && cp -R public /tmp/${folder}/public`);
    // await exec(`cd ./${folder} && cp cloudbuild.json  /tmp/${folder}`);
    await exec(`cd ./${folder} && cp package-lock.json  /tmp/${folder}/functionsES6/`);
    // await exec(`cd ./${folder} && cp Dockerfile  /tmp/${folder}`);
    await exec(`cd ./${folder} && cp firebase.json  /tmp/${folder}`);
    await exec(`cd ./${folder} && cp package.json  /tmp/${folder}`);
    await exec(`cd ./${folder} && cp package-lock.json  /tmp/${folder}`);
    await exec(`cp ./${folder}.babelrc /tmp/${folder}`)
    await exec(`cd ./${folder} && cp index.js  /tmp/${folder}/functionsES6/`);
    console.log(`npm i`);
    await exec(`cd /tmp/${folder} && npm i  babel-cli babel-preset-es2015 babel-preset-stage-0  babel-preset-env babel-plugin-transform-runtime@6.23.0 babel-runtime@6.23.0`);
    await exec(`cd /tmp/${folder} && npm run package-functions`);
    let jsonString = fs.readFileSync(`/tmp/${folder}functions/package.json`);
    let json = JSON.parse(jsonString);
    json.main = "index.js"
    json.engines = {"node": "8"}
    let data = JSON.stringify(json,null,4);
    fs.writeFileSync(`/tmp/${folder}functions/package.json`, data);
    await exec(`cd /tmp/${folder}functions/ && npm i && npm i firebase-admin firebase-functions`);// hapi@16.1.0

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
