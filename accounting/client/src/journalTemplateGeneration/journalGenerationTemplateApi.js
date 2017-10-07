
class JournalGenerationTemplateApi{

    constructor(devConstants, apiPromise){

        this.urlPrefix = `${devConstants.urls.rootUrl}/journal-generation-templates`;
        this.apiPromise = apiPromise;
    }

    save(type,data){
        return this.apiPromise.post(`${this.urlPrefix}/${type}`, data);
    }

    get(type){
        return this.apiPromise.get(`${this.urlPrefix}/${type}`);
    }

}

export default JournalGenerationTemplateApi;