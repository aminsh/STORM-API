import { Module } from "../Infrastructure/ModuleFramework";
import { PersonRepository } from "./person.repository";
import { PersonService } from "./person.service";

@Module({
    providers: [PersonRepository, PersonService]
})
export class PersonModule {
}