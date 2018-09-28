import {injectable, postConstruct} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class JobManager {

    boss = undefined;

    @postConstruct()
    init() {

        const boss = this.boss = new PgBoss(process.env.DATABASE_URL);

        boss.on('error', error => console.log(error));

        toResult(boss.start());
    }

    publish(queueName, data) {

        const jobId = toResult(this.boss.publish(queueName, data));

        return jobId;
    }

    subscribe(queueName, handler) {

        toResult(this.boss.subscribe(queueName, handler));
    }

    unsubscribe(queueName) {
        toResult(this.boss.unsubscribe(queueName));
    }

    hasQueue(queueName) {
        return Object.keys(this.boss.manager.subscriptions).includes(queueName);
    }
}