import {createConnection} from "typeorm";

export const Database = {
    async register() {
        await createConnection({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [
                __dirname + '/../**/*.entity{.ts,.js}'
            ],
            logging: "all",
            synchronize: false
        });
    }
};