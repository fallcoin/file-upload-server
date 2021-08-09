const path = require('path');
const fs = require('fs');
const SparkMD5 = require('spark-md5');

const BASE_PATH = path.join(__dirname, '../../upload/')

const uploadByFormData = function (file) {
    return new Promise(resolve => {
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        let filePath = BASE_PATH + `${file.name}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        upStream.on('finish', () => {
            resolve({
                msg: 'upload success'
            })
        })
    })
}

const uploadByBase64 = function (chunk, filename) {
    chunk = decodeURIComponent(chunk);
    chunk = chunk.replace(/^data:image\/w+;base64,/, '');
    chunk = Buffer.from(chunk, 'base64');
    let spark = new SparkMD5.ArrayBuffer(),
        suffix = /\.([0-9a-zA-Z]+)$/.exec(filename)[1],
        path;
    spark.append(chunk);
    path = `${BASE_PATH}/${spark.end()}.${suffix}`;
    fs.writeFileSync(path, chunk);
    return {
        msg: 'upload success'
    }
}

const uploadBySlice = function (chunk, filename) {
    return new Promise(resolve => {
        let hash = /([0-9a-zA-Z]+)_\d+/.exec(filename)[1],
            path = `${BASE_PATH}/${hash}`;
        !fs.existsSync(path) ? fs.mkdirSync(path) : null;
        path = `${path}/${filename}`;
        fs.access(path, async err => {
            if (!err) {
                resolve({
                    code: 200,
                    path: path.replace(__dirname, `http://127.0.0.1:3300`)
                })
            }

            await new Promise(resolve => {
                setTimeout(() => {
                    resolve()
                }, 200);
            })

            let readStream = fs.createReadStream(chunk.path),
                writeStream = fs.createWriteStream(path);
            readStream.pipe(writeStream);
            readStream.on('end', function () {
                fs.unlinkSync(chunk.path);
                resolve({
                    path: path.replace(__dirname, `http://127.0.0.1:3300`)
                })
            })
        })
    })
}

const merge = function (hash) {
    let path = `${BASE_PATH}/${hash}`,
        fileList = fs.readdirSync(path),
        suffix;
    fileList.sort((a, b) => {
        let reg = /_(\d+)/;
        return reg.exec(a)[1] - reg.exec(b)[1];
    }).forEach(item => {
        !suffix ? suffix = /\.([0-9a-zA-Z]+)$/.exec(item)[1] : null;
        fs.appendFileSync(`${BASE_PATH}/${hash}.${suffix}`, fs.readFileSync(`${path}/${item}`));
        fs.unlinkSync(`${path}/${item}`);
    })
    fs.rmdirSync(path);
    return {
        path: `http://127.0.0.1:3300/upload/${hash}.${suffix}`
    }
}

module.exports = {
    uploadByFormData,
    uploadByBase64,
    uploadBySlice,
    merge
}