const knex = instanceOf('knex');

class ApplicationServiceLogger {

    tableName = 'applicationLogger';

    async start(id, command) {
        const req = command.state,
            state = {
                fiscalPeriodId: req.fiscalPeriodId,
                user: req.user,
                query: req.query,
                body: req.body,
                params: req.params,
                originalUrl: req.originalUrl
            },

            entity = {
                id,
                branchId: command.state.branchId,
                service: command.service,
                command: command.command,
                state: JSON.stringify(state),
                status: 'pending'
            };

        return knex(this.tableName).insert(entity);
    }

    async success(id, result) {
        const entity = {
            updatedAt: new Date,
            status: 'success',
            result: JSON.stringify(result)
        };

        return knex(this.tableName).where('id', id).update(entity);
    }

    async error(id, error) {
        const entity = {
            updatedAt: new Date,
            status: 'error',
            result: JSON.stringify({message: error.message, stack: error.stack, errors: error.errors})
        };

        return knex(this.tableName).where('id', id).update(entity);
    }

    async invalid(id, error) {
        const entity = {
            updatedAt: new Date,
            status: 'invalid',
            result: JSON.stringify({message: error.message, stack: error.stack, errors: error.errors})
        };

        return knex(this.tableName).where('id', id).update(entity);
    }
}

const applicationServiceLogger = new ApplicationServiceLogger();

EventEmitter.on('onServiceStarted', async (serviceId, command) => {
    await applicationServiceLogger.start(serviceId, command);
    console.log(`apiService => ${serviceId} started ...`);
});

EventEmitter.on('onServiceSucceed', async (serviceId, result) => {
    await applicationServiceLogger.success(serviceId, result);
    console.log(`apiService => ${serviceId} succeed ...`);
});

EventEmitter.on('onServiceFailed', async (serviceId, error) => {
    await applicationServiceLogger.error(serviceId, error);
    console.log(`apiService => ${serviceId} failed ...`);
});

EventEmitter.on('onServiceInvalid', async (serviceId, error) => {
    await applicationServiceLogger.invalid(serviceId, error);
    console.log(`apiService => ${serviceId} failed ...`);
});
