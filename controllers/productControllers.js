import { createDataProduct, deleteProductDataById, getDataProducts, getProductDataById } from "../services/productServices.js";


export const getProducts = async (req, res, next) => {
    try {
        const { prodName, priceStart, priceEnd, prodDesc, page, limit } = req.query;
        req.log.info({ prodName, priceStart, priceEnd, prodDesc, page, limit }, 'Get products request');

        const result = await getDataProducts({ page, limit, prodName, priceStart, priceEnd, prodDesc });

        req.log.info({ prodName, priceStart, priceEnd, prodDesc, page, limit }, 'Get products success');

        return res.status(200).json({
            message: "Data found",
            data: result.data,
            metadata: {
                total: result.total,
                page: result.page,
                totalPages: result.totalPages
            }
        });
    } catch (err) {
        req.log.error(err, 'Get products failed');
        next(err);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const { name, price, description } = req.validatedBody;
        req.log.info({ name }, 'Create product request');

        await createDataProduct({ name, price, description });

        req.log.info({ name, price, description }, 'Product created successfully');

        return res.status(201).json({
            message: "Product created successfully",
            data: req.validatedBody
        })
    } catch (err) {
        req.log.error(err, 'Create product failed');
        next(err);
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        req.log.info({ id }, 'Get product by ID request');

        const result = await getProductDataById(id);

        req.log.info({ id }, 'Get product by ID success');

        return res.status(200).json({
            message: "Data found",
            data: result
        });
    } catch (err) {
        req.log.error(err, 'Get product by ID failed');
        next(err);
    }
}

export const deleteProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        req.log.info({ id }, 'Delete product request');

        const result = await deleteProductDataById(id);

        req.log.info({ id }, 'Delete product success');

        return res.status(200).json({
            message: "Data deleted successfully",
            data: result
        });
    } catch (err) {
        req.log.error(err, 'Delete product failed');
        next(err);
    }
}