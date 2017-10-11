class FileService{

    constructor(promise){

        this.promise = promise;

    }

    readFile(e){

        return this.promise.create(resolve => {

            let file = e.target.files[0],
                reader = new FileReader();

            reader.onload = e => resolve(e.target.result);

            reader.readAsArrayBuffer(file);
        });
    }
}

export default FileService;