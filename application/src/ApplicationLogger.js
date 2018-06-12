import toDirectResult from "asyncawait/await";

const knex = instanceOf('knex');

export class ApplicationServiceLogger {

    /**@private*/
    tableName = 'applicationLogger';

    /** @return {void}*/
    start(id, command) {
        const req = command.state,
            state = {
                fiscalPeriodId: req.fiscalPeriodId,
                user: req.user,
                query: req.query,
                body: req.body,
                params: req.params,
                originalUrl: req.originalUrl,
                apiCaller: req.apiCaller
            },

            entity = {
                id,
                branchId: command.state.branchId,
                service: command.service,
                command: command.command,
                state: JSON.stringify(state),
                status: 'pending'
            };

        toDirectResult(knex(this.tableName).insert(entity));
    }

    /** @return {void}*/
    success(id, result) {
        const entity = {
            updatedAt: new Date,
            status: 'success',
            result: JSON.stringify(result)
        };

        toDirectResult(knex(this.tableName).where('id', id).update(entity));
    }

    /** @return {void}*/
    error(id, error) {
        const entity = {
            updatedAt: new Date,
            status: 'error',
            result: JSON.stringify({message: error.message, stack: error.stack, errors: error.errors})
        };

        toDirectResult(knex(this.tableName).where('id', id).update(entity));
    }

    /** @return {void}*/
    invalid(id, error) {
        const entity = {
            updatedAt: new Date,
            status: 'invalid',
            result: JSON.stringify({message: error.message, stack: error.stack, errors: error.errors})
        };

        toDirectResult(knex(this.tableName).where('id', id).update(entity));
    }
}
