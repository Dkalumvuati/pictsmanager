const fs = require('fs');
import rimraf from 'rimraf';

const removeFile = async function (file_path : string) {
    try {
        if (await fs.existsSync(file_path)) {
            await fs.unlinkSync(file_path);
            return true;
        }
    } catch (e) {
        console.log(e);
    }
    return false;
}

const removeDir = async function (file_path : string) {
    try {
        if (await fs.existsSync(file_path)) {
            await rimraf(file_path, function () {
                return true;
            })
        }
    } catch (e) {
        console.log(e);
    }
    return false;
}

module.exports = {
    removeFile,
    removeDir
}