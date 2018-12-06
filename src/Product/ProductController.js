import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/products", "ShouldHaveBranch")
class ProductController {

    @inject("ProductQuery")
    /**@type {ProductQuery}*/productQuery = undefined;

    @inject("ProductService")
    /**@type {ProductService}*/ productService = undefined;

    @Get("/")
    getAll(req) {

        return this.productQuery.getAll(req.query);
    }

    @Get("/goods")
    getAllGoods(req) {

        return this.productQuery.getAllGoods(req.query);
    }

    @Post("/")
    create(req) {

        const id = this.productService.create(req.body);

        return this.productQuery.getById(id);
    }

    @Get("/:id")
    getById(req) {

        return this.productQuery.getById(req.params.id);
    }

    @Put("/:id")
    update(req) {

        this.productService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    remove(req) {

        this.productService.remove(req.params.id);
    }

    @Post("/batch")
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

        //this.productService.addManyToInventoryInputFirst(firstInputList, body.stockId);

        return ids;
    }

    @Post("/batch")
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