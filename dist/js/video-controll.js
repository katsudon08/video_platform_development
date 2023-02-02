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

}) ();