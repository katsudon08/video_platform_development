const { response } = require('express');
const express = require('express');
const app = express();
const formData = require('express-form-data');
const fs = require('fs');
const readline = require('readline');
const passport = require('passport');
const passportHTTP = require('passport-http');

const port = 3000;
const htmlPath = __dirname + '/dist/html/home.html';
const upDir = 'dist/upload';
const logPath = 'log/log.txt';

// distファイル下の静的ファイルの提供
app.use(express.static('dist'));
app.use(express.static(logPath));
// postで来たFormDataの保存先指定とクリーンをするかの指定
app.use(formData.parse({uploadDir: upDir, autoClean: false}));

const userMatch = 'admin';
const passMatch = '123';

passport.use(new passportHTTP.BasicStrategy(
    (username, password, done) => {
        if(username === userMatch && password === passMatch) {
            return done(null, true);
        }else {
            return done(null, false);
        }
    }
));

app.get('/',
    passport.authenticate('basic', {
        session: false,
    }),
    (req, res) => {
        // htmlファイルの表示
        res.sendFile(htmlPath);
    }
);

app.get('/log/log.txt', async (req, res) => {
    const readResult = await readFile(logPath);
    let responseData = new Array();
    let responseJson = {
        "name": "",
        "date": "",
        "path": ""
    };
    if (readResult === false) {
        res.send(`file read is ${readResult}`);
    }else {
        for(const lineArray of readResult) {
            responseJson.name = lineArray.split(',')[0];
            responseJson.date = lineArray.split(',')[1];
            responseJson.path = lineArray.split(',')[2];
            responseData.push(responseJson);
        }
        console.log(responseData);
        res.send(responseData);
    }
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

    if(checkFile(logPath)) {
        const appendResult = addFile(logPath, dataStream);
        console.log(`stream append processing is ${appendResult}`);
    }else {
        const writeResult = newWriteFile(logPath, dataStream);
        console.log(`file make processing is ${writeResult}`);
    }
    res.send({name: videoName, date: videoSaveDate, path: pathResult});
});

// status404 not found
app.use((req, res, next) => {
    res.status(404).send('<h1>404 page is not founded</h1>');
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

const readFile = async (filePath) => {
    try {
        const stream = fs.createReadStream(filePath, {
            // 文字コード
            encoding: 'utf-8',
            // 一度に取得するバイト数
            highWaterMark: 1024
        });

        // readlineにstreamを渡す
        const reader = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });
        let textArray = new Array();
        for await (const line of reader) {
            textArray.push(line);
        }
        console.log(textArray);

        return textArray;
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