let isClientTest = ()=> {
    let isClientTest = localStorage.getItem('isClientTest');

    return isClientTest == null ? false : true;
}


let baseTemplateUrl = ()=> {
    return isClientTest() ? 'partials/' : '';
}

let config = {
    isClientTest: isClientTest,
    baseTemplateUrl: baseTemplateUrl
};

export default config;