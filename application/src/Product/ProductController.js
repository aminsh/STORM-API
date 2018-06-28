import {Controller, Delete, Get, Post, Put} from "../core/expressUtlis";
import {async} from "../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/products", "ShouldHaveBranch")
class ProductController {

    @inject("ProductQuery")
    /**@type {ProductQuery}*/productQuery = undefined;

    @inject("ProductService")
    /**@type {ProductService}*/ productService = undefined;

    @Get("/")
    @async()
    getAll(req) {

        return this.productQuery.getAll(req.query);
    }

    @Post("/")
    @async()
    create(req) {

        this.productService.create(req.body);
    }

    @Get("/:id")
    @async()
    getById(req) {

        return this.productQuery.getById(req.params.id);
    }

    @Put("/:id")
    @async()
    update(req) {

        this.productService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    @async()
    remove(req) {

        this.productService.remove(req.params.id);
    }

    @Get("/")
    @async()
    getAllGoods(req) {

        return this.productQuery.getAllGoods(req.query);
    }

    @Post("/batch")
    @async()
    batch(req) {

        const body = req.body;

        const ids = this.productService.createBatch(body.products);

        if (!body.stockId) return ids;

        let firstInputList = this.productQuery.getManyByIds(ids).asEnumerable()
            .join(
                body.products.asEnumerable().where(item => item.quantity && item.quantity > 0).toArray(),
                first => first.title,
                second => second.title,
                (first, second) => ({
                    productId: first.id,
                    stockId: body.stockId,
                    quantity: second.quantity,
                    unitPrice: second.unitPrice
                }))
            .toArray();

        this.productService.addManyToInventoryInputFirst(firstInputList, body.stockId);

        return ids;
    }

    @Post("/batch")
    @async()
    addToInputFirst(req) {

        let items = req.body.asEnumerable()
            .select(item => ({
                stockId: item.stockId,
                items: [{productId: req.params.id, quantity: item.quantity, unitPrice: item.unitPrice}]
            }))
            .toArray();


        items.forEach(item => this.productService.addManyToInventoryInputFirst(item.items, item.stockId));
    }
}