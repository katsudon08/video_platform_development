(() => {
    // 動画のアップロード
    const fileButton = document.getElementById('file_send');

    const upload = async (formData) => {
        const url = 'http://localhost:3000';
        //戻り値に  promiseを返すようにするため、awaitで一時停止する必要がある
        try {
            const response = await fetch(url, {method: 'POST', body: formData});
            if(response.status !== 200) {
                console.log(`response.ok: ${response.ok}`);
                console.log(`response.status: ${response.status}`);
                console.log(`response.statusText: ${response.statusText}`);
                throw new Error('Internal server error');
            }else {
                // response.text()を表示した後に、promiseの値が返ってきていたのでundefinedになっていたものと思われる
                return await response.json();
            }
        }catch(error) {
            console.error(error);
            return null;
        }
    };

    fileButton.addEventListener('click', async () => {
        const inputFile = document.getElementById('file_select').files[0];

        if(inputFile === undefined) {
            alert('ファイルを選択してください');
            console.log('false');
        }else {
            const fileName = inputFile.name;
            const fileExtention = fileName.substring(fileName.lastIndexOf('.'));
            let newName = prompt('ファイル名を入力してください');
            // newNameのnull判別
            newName ? newName += fileExtention : newName = fileName;
            const blob = inputFile.slice(0, inputFile.size, inputFile.type);
            const renamedFile = new File([blob], newName, {type: inputFile.type});

            const formData = new FormData(document.getElementById('file_form'));
            formData.append('newFile', renamedFile);

            const responseData = await upload(formData);
            console.log(responseData.name);
            console.log(responseData.date);
            console.log(responseData.path);
            const setPath = './../upload/'+responseData.path;
            console.log(setPath);

            videoDisplay(responseData.name, responseData.date, setPath);
        }
    });

    document.addEventListener('DOMContentLoaded', async () => {
        const url = './../../log.txt';
        try {
            const response = await fetch(url, {method: 'POST'});
            if(response.status !== 200) {
                console.log(`response.ok: ${response.ok}`);
                console.log(`response.status: ${response.status}`);
                console.log(`response.statusText: ${response.statusText}`);
                throw new Error('Internal server error');
            }else {
                console.log(response.text());
            }
        }catch(error) {
            console.error(error);
            return null;
        }
    });

    // 動画の検索

    // テキストファイルから取得

    // 動画の表示
    const videoDisplay = (name, date, path)=> {
        const videoList = document.getElementById('lower_part');
        videoList.appendChild(newElement(name, date, path));
    }

    // 動画の要素の新規作成
    const newElement = (name, date, src)=>{
        console.log(name);
        console.log(date);
        const videoWrapper = document.createElement('div');
        const videoDescription = [document.createElement('span'), document.createElement('span')];
        const video = document.createElement('video');
        const source = document.createElement('source');
        videoWrapper.className = 'videoWrapper';
        for(let i=0; i<2; i++) {
            videoDescription[i].className = 'videoElement';
        }

        video.className = 'video';
        video.width = 250;
        video.controls = true;
        source.src = src;
        video.appendChild(source);
        videoWrapper.appendChild(video);
        videoDescription[0].textContent = name;
        videoDescription[1].textContent = date;
        for(let i=0; i<2; i++) {
            console.log(videoDescription[i  ]);
            videoWrapper.appendChild(videoDescription[i]);
        }

        return videoWrapper;
    };
}) ();