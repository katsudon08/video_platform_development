const express = require('express');
const app = express();
const mysql = require('mysql2');
const formData = require('express-form-data');
const fs = require('fs');

// sql
const client = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'akihiko',
    password: 'akihiko171101',
    database: 'shares'
});

client.connect((error) => {
    error ? console.error(`error connecting: ${error.stack}\n`) : console.log(`connected as id ${client.threadId}\n`);
});

const port = 3000;

const htmlPath = __dirname + '/dist/html/home.html';
const upDir = 'dist/upload';

// distファイル下の静的ファイルの提供
app.use(express.static('dist'));
// postで来たFormDataの保存先指定とクリーンをするかの指定
app.use(formData.parse({uploadDir: upDir, autoClean: false}));

app.get('/', (req, res) => {
    // htmlファイルの表示
    res.sendFile(htmlPath);
});

app.post('/', (req, res) => {
    const deletedFile = req.files.videos;
    const renamedFile = req.files.newFile;
    const videoName = renamedFile.name;
    const videoPath = renamedFile.path;

    // deletedFileを削除
    if(checkFile(deletedFile.path)) {
        const deletedResult = deleteFile(deletedFile.path);
        console.log(`fileDelete processing is ${deletedResult}`);
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth()+1;
    const date = now.getDate();
    const videoSaveDate = year+'年 '+month+'月 '+date+'日';
    // ファイル名だけ切り取り
    const pathResult = videoPath.substr(12);
    const dataStream = videoName+','+videoSaveDate+','+pathResult;
    console.log(dataStream);

    const logPath = 'log.txt';
    if(checkFile(logPath)) {
        const appendResult = addFile(logPath, dataStream);
        console.log(`stream append processing is ${appendResult}`);
    }else {
        const writeResult = newWriteFile(logPath, dataStream);
        console.log(`file make processing is ${writeResult}`);
    }
    // res.send({name: videoName, date: videoSaveDate, path: pathResult});
    res.end();
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

const checkFile = (filePath) => {
    let isExist = false;
    try {
        fs.statSync(filePath);
        isExist = true;
    }catch(error) {
        isExist = false;
        console.error(error);
    }
    return isExist;
}

const newWriteFile = (filePath, stream) => {
    try {
        fs.writeFile(filePath, stream.concat('\n'), (error) => {
            if(error) {
                throw error;
            }
        });
        return true;
    }catch(error) {
        console.error(error);
        return false;
    }
}

const addFile = (filePath, stream) => {
    try {
        fs.appendFileSync(filePath, stream.concat('\n'));
        return true;
    }catch(error) {
        console.error(error);
        return false;
    }
}

const deleteFile = (filePath) => {
    try {
        fs.unlinkSync(filePath);
        return true;
    }catch(error) {
        console.error(error);
        return false;
    }
}