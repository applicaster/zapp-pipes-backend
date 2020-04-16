const YAML = require('yaml')
const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var args = process.argv.slice(2);
const APP_NAME = args[0];
const appFolder = `apps/${APP_NAME}/`;

const config = getConfig(appFolder);
// installNPM(appFolder, config.app.npm_packages,config.app.npm_version);
deployToServer(appFolder,config.app.deploy);

function deployToServer(folder,fileToRun){
    deploy(folder, fileToRun)
}

async function deploy(folder,fileToRun){
    const { stdout, stderr } =  await exec(`./${folder}${fileToRun}`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}
function installNPM(folder,packages_name,package_version){
    install(folder,
            packages_name,
            package_version)
}
async function install(folder,packages_name,package_version){
    await exec(`rm -rf ./${folder}node_modules/`);
    await exec(`npm i --prefix ${folder} ${packages_name}@${package_version}`);
    await exec(`cp ./${folder}.babelrc ./${folder}node_modules/${packages_name}/`);
    await exec(`cp ./${folder}/.npmrc ./${folder}node_modules/${packages_name}/`);
    await exec(`npm --prefix ./${folder}node_modules/${packages_name} install`);

    // this lines is only for test
    //console.log("node starting at localhost:8080")
    //await exec(`npm --prefix ./${folder}node_modules/${packages_name}/ start`);
}

function getConfig(folderPath){
    var config_path = `${folderPath}app_config.yaml`
    const yaml_file = fs.readFileSync(config_path, 'utf8')
    return YAML.parse(yaml_file);
}
