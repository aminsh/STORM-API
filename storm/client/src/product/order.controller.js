"use strict";

export default class OrderController {
    constructor(orderApi, $stateParams, setDirty, logger, $state) {
        this.order = {
            email: '',
            phone: '',
            plan: $stateParams.plan
        };
        this.orderApi = orderApi;
        this.setDirty = setDirty;
        this.logger = logger;
        this.$state = $state;
    }

    sendRequest(form){
        if(form.$invalid)
            return this.setDirty(from);

        this.orderApi.send(this.order)
            .then(result =>{
                this.logger.success('اطلاعات شما با موفقیت ثبت شد و حداکثر تا 24 ساعت آینده با شما تماس گرفته می شود.')
                    .then(()=> this.$state.go('home'))
            });
    }
}

OrderController.$inject = ['orderApi','$stateParams','setDirty', 'logger', '$state'];