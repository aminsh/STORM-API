import {EntityBase} from "./EntityBase";
import {Column, JoinColumn, OneToMany, OneToOne} from "typeorm";
import {DetailAccount} from "./DetailAccount";
import {Inventory, Stock} from "./Inventory";
import {Product} from "./Product";

const Enums = instanceOf('Enums');

export class Invoice extends EntityBase {

    @Column("int")
    number = undefined;

    @Column("varchar")
    date = undefined;

    @Column("varchar")
    title = undefined;

    @Column("text")
    description = undefined;

    @Column("varchar")
    orderId = undefined;

    @Column("varchar")
    ofInvoiceId = undefined;

    @Column({name: 'invoiceStatus', type: "enum", enum: Enums.InvoiceStatus().data})
    status = undefined;

    @Column({type: "enum", enum: Enums.InventoryIOType().data})
    ioType = undefined;

    @OneToOne(type => DetailAccount, {eager: true})
    @JoinColumn({name: "detailAccountId", referencedColumnName: "id"})
    person = undefined;

    @OneToOne(type => Journal)
    @JoinColumn({name: "journalId", referencedColumnName: "id"})
    journal = undefined;

    @OneToMany(type => InvoiceLine, InvoiceLine => InvoiceLine.invoice, {eager: true})
    invoiceLines = [];

    @OneToMany(type => Inventory, Inventory => Inventory.invoice)
    inventories = [];

    @Column('json[]')
    costs = [];

    @Column('json[]')
    charges = [];
}

export class InvoiceLine extends EntityBase {

    @OneToOne(type => Product, {eager: true})
    @JoinColumn({name: "productId", referencedColumnName: "id"})
    product = undefined;

    @Column("text")
    description = undefined;

    @Column("decimal")
    quantity = undefined;

    @Column("decimal")
    unitPrice = undefined;

    @Column("decimal")
    discount = undefined;

    @OneToOne(type => Invoice)
    @JoinColumn({name: "invoiceId", referencedColumnName: "id"})
    invoice = undefined;

    @Column("decimal")
    vat = undefined;

    @OneToOne(type => Stock, {eager: true})
    @JoinColumn({name: "stockId", referencedColumnName: "id"})
    stock = undefined;
}