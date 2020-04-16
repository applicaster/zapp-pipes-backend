const YAML = require('yaml')
const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var args = process.argv.slice(2);
const APP_NAME = args[0];
const FOLDER_PATH = args[1];

run(APP_NAME,FOLDER_PATH);

function run(app_name,folder_path){
    try{
        syncWorkflow(app_name,folder_path)
    }
    catch(ex){
        console.log("ERROR",ex);
    }
}
async function syncWorkflow(app_name,folder_path){
    await exec(`rm -rf ./${folder_path}node_modules/`);
    await exec(`rm -rf ./${folder_path}functionsES6/node_modules/`);
    await exec(`rm -rf ./${folder_path}functions/`);
    console.log("getConfig")
    const config = await getConfig(folder_path);
    console.log("deployToServer")
    await deployToServer(folder_path,config.app.deploy);
}
async function deployToServer(folder){
    console.log(`npm i`);
    await exec(`cd ./${folder} && npm i babel-cli babel-preset-es2015 babel-preset-stage-0  babel-preset-env babel-plugin-transform-runtime@6.23.0 babel-runtime@6.23.0`);
    await exec(`cd ./${folder} && npm run package-functions`);
    await exec(`cd ./${folder}functions && cat <<EOF > ./.npmrc
    //registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`);

    await exec(`cd ./${folder} && npm i`);
    await exec(`cd ./${folder}functions/ && npm i`);
}

async function getConfig(folderPath){
    var config_path = `${FOLDER_PATH}app_config.yaml`
    const yaml_file = fs.readFileSync(config_path, 'utf8')
    return YAML.parse(yaml_file);
}
