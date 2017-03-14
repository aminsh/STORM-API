module.exports = {
    rootPath: null,
    user: {
        image: `data:image/png;base64,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`
    },
    port: process.env.PORT || 1001,
    version: {
        vendor: '1.0.0',
        acc: '1.0.0',
        css: '1.0.0',
        template: '1.0.0'
    },
    auth: {
        url: 'https://storm-online.ir/auth',
        returnUrl: 'https://luca.storm-online.ir/auth/return',
        storm: {
            getBranches: 'https://storm-online.ir/api/branches'
        }
    },
    redis:{
        url: ''
    }
};
