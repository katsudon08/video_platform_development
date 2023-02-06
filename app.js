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
    try {
        fs.unlinkSync(deletedFile.path);
        console.log('deletedFileを削除しました\n');
    }catch(error) {
        throw error;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth()+1;
    const date = now.getDate();
    const videoSaveDate = year+'年 '+month+'月 '+date+'日';

    // console.log(renamedFile.name);
    // console.log(renamedFile.path);
    // console.log(videoSaveDate);

    // insert(renamedFile.name, renamedFile.path, fileBuffer);

    res.send({name: videoName, saveDate: videoSaveDate, videoPath});
});

app.listen(port, () => {
    console.log(`start on http://localhost:${port}`);
});

const insert = (name, path, file) => {
    client.query('INSERT INTO videos', {name: name, path: path, file: file}, (error, res) => {
        if(error) throw error;
        console.log(res);
    });
}

const query = () => {
    client.query('SELECT * FROM videos', (error, res) => {
        if(error) throw error;
        console.log(res);
    })
}