import {ProductService} from "./ProductService";
import {Controller, Get, body, Post, Put, parameter, Delete, query} from "../Infrastructure/ExpressFramework/index";
import {ProductView} from "./ProductView";
import {ProductQuery} from "./ProductQuery";
import {Inject} from "../Infrastructure/DependencyInjection/index";

@Controller("/v1/products", "ShouldHaveBranch")
class ProductController {

    @Inject("ProductService")
    productService: ProductService;

    @Inject("ProductQuery")
    productQuery: ProductQuery;

    @Get("/")
    async getAll(@query() query: Parameters): Promise<Page<ProductView> | ProductView[]> {

        return this.productQuery.getAll(query);
    }

    @Get("/:id")
    async getById(@parameter("id") id: string): Promise<ProductView> {

        return this.productQuery.getById(id);
    }

    @Get("/by-category/:categoryId")
    async getByCategory(@parameter("categoryId") categoryId: string): Promise<ProductView[]> {

        return this.productQuery.getByCategory(categoryId);
    }

    @Post("/")
    async create(@body() command: ProductCommand): Promise<ProductView> {

        const product = this.productService.create(command);

        return this.productQuery.getById(product.id);

    }

    @Put("/:id")
    async update(@body() command: ProductCommand, @parameter("id") id: string): Promise<ProductView> {

        this.productService.update(id, command);

        return this.productQuery.getById(id);
    }

    @Delete("/:id")
    async remove(@parameter("id") id: string): Promise<void> {

        this.productService.remove(id);
    }
}
