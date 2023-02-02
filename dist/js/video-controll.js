(() => {
    // 動画のアップロード
    const fileButton = document.getElementById('file_send');

    const upRoad = (formData) => {
        fetch('http://localhost:3000', {
            method: 'POST',
            body: formData
        }).then((response) => {
            if(!response.ok) {
                console.error('response.ok: ', response.ok);
                console.error('response.status: ', response.status);
                console.error('response.statusText: ', response.statusText);

                throw new Error(('network response is not OK'));
            }else {
                console.log(response);
            }
        }).catch((error) => {
            console.error('Error: ', error);
        });

    }

    fileButton.addEventListener('click', () => {
        const inputFile = document.getElementById('file_select').files[0];

        if(inputFile === undefined) {
            alert('ファイルを選択してください');
            console.log('false');
        }else {
            let newName = prompt('ファイル名を入力してください');
            const fileName = inputFile.name;
            const fileExtention = fileName.substring(fileName.lastIndexOf("."));
            const blob = inputFile.slice(0, inputFile.size, inputFile.type);
            const renamedFile = new File([blob], newName + fileExtention, {type: inputFile.type});

            const formData = new FormData(document.getElementById('file_form'));
            formData.append('newFile', renamedFile);
            upRoad(formData);
        }
    });

    // 動画の検索

    // 動画の表示
    const videoDisplay = (newVideo)=> {
        // やること
        // 1.innerHTMLで既存のビデオタグをコピーしてその名前と日付とともに動画を表示
        // 2.もし何も保存されていない場合は、関数側でvideoWrapperの中身を作成、表示
        // 3.日付順にソートして動画を表示する
        
        const videoList = document.getElementById('lower_part');
        videoList.append(newVideo);
    }
}) ();