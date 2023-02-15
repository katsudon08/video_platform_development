(() => {
    const fs = require('fs');

    const targetRemovePath = './dist/upload';
    const targetRemoveFiles = fs.readdirSync(targetRemovePath);
    console.log(targetRemoveFiles);
    for(let file in targetRemoveFiles) {
        fs.unlinkSync(targetRemovePath+'/'+targetRemoveFiles[file]);
    }
    const logPath = './log/log.txt';
    try {
        fs.writeFile(logPath, '', (error) => {
            if(error) {
                throw error;
            }
        });
    }catch(error) {
        console.error(error);
    }
}) ();