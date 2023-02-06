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
                const convertRes = await response.json();
                console.log(convertRes.name)                                             ;
                // return convertRes;
            }
        }catch(error) {
            console.error(error);
            // return null;
        }
    };

    fileButton.addEventListener('click', () => {
        const inputFile = document.getElementById('file_select').files[0];

        if(inputFile === undefined) {
            alert('ファイルを選択してください');
            console.log('false');
        }else {
            const fileName = inputFile.name;
            const fileExtention = fileName.substring(fileName.lastIndexOf('.'));
            let newName = prompt('ファイル名を入力してください');
            // 三項演算子の使用を確認した後に、null時の仕様を修正
            newName ? newName += fileExtention : newName = fileName;
            const blob = inputFile.slice(0, inputFile.size, inputFile.type);
            const renamedFile = new File([blob], newName, {type: inputFile.type});

            const formData = new FormData(document.getElementById('file_form'));
            formData.append('newFile', renamedFile);
            // upload(formData);
            // console.log(upload(formData));
            // upload(formData) ? console.log(upload(formData)) : console.error('Error: undefined or null this value');
        }
    });

    // 動画の検索

    // 動画の表示
    const videoDisplay = (name, date, path)=> {
        // やること
        // 2.もし何も保存されていない場合は、関数側でvideoWrapperの中身を作成、表示
        // 3.日付順にソートして動画を表示する

        const videoList = document.getElementById('lower_part');
        videoList.appendChild(newElement(name, date, path));
    }

    // 動画の要素の新規作成
    const newElement = (name, date, src)=>{
        const videoWrapper = document.createElement('div');
        const videoDescription = [document.createElement('div'), document.createElement('div')];
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
            videoWrapper.appendChild(videoDescription[i]);
        }

        return videoWrapper;
    };
}) ();