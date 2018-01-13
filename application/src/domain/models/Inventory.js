import {EntityBase} from "./EntityBase";
import {Column, JoinColumn, OneToMany, OneToOne} from "typeorm";
import {FiscalPeriod} from "./FiscalPeriod";
import {Invoice} from "./Invoice";
import {Journal} from "./Journal";
import {Product} from "./Product";

const Enums = instanceOf('Enums');

export class Inventory extends EntityBase {

    @Column("int")
    number = undefined;

    @Column("varchar")
    date = undefined;

    @Column("varchar")
    description = undefined;

    @Column({type: "enum", enum: ['input', 'output']})
    inventoryType = undefined;

    @Column({type: "enum", enum: Enums.InventoryIOType().data})
    ioType = undefined;

    @Column("boolean")
    fixedQuantity = undefined;

    @Column("boolean")
    fixedAmount = undefined;

    @Column("boolean")
    shipped = undefined;

    @OneToOne(type => FiscalPeriod, {eager: true})
    @JoinColumn({name: "fiscalPeriodId", referencedColumnName: "id"})
    fiscalPeriod = undefined;

    @OneToOne(type => Stock, {eager: true})
    @JoinColumn({name: "stockId", referencedColumnName: "id"})
    stock = undefined;

    @OneToOne(type => Invoice, {eager: true})
    @JoinColumn({name: "invoiceId", referencedColumnName: "id"})
    invoice = undefined;

    @OneToOne(type => Journal)
    @JoinColumn({name: "journalId", referencedColumnName: "id"})
    journal = undefined;

    @OneToMany(type => InventoryLine, InventoryLine => InventoryLine.inventory, {eager: true})
    journalLines = [];

}

export class InventoryLine extends EntityBase {

    @OneToOne(type => Product, {eager: true})
    @JoinColumn({name: "productId", referencedColumnName: "id"})
    product = undefined;

    @Column("decimal")
    quantity = undefined;

    @Column("decimal")
    unitPrice = undefined;

    @OneToOne(type => Inventory)
    @JoinColumn({name: "inventoryId", referencedColumnName: "id"})
    Inventory = undefined;
}

export class Stock extends EntityBase {

    @Column("varchar")
    title = undefined;
}