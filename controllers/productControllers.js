import { createDataProduct, deleteProductDataById, filterDataProducts, getDataProducts, getProductDataById } from "../services/productServices.js";


export const getProducts = async (req, res, next) => {
    try {
        const { prodName, priceStart, priceEnd, prodDesc, page, limit } = req.query;

        const result = await getDataProducts({ page, limit, prodName, priceStart, priceEnd, prodDesc });

        // const filterData = await filterDataProducts({ prodName, prodPrice, prodDesc, queryPage, queryLimit });

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
        next(err);
    }
};

export const filterProductsData = async (req, res, next) => {
    try {
        const { name, price, description } = req.query;

        const data = await filterDataProducts({ name, price, description });

        return res.status(200).json({
            message: data.message,
            data: data.data
        });
        
    } catch (err) {
        next(err);
    }
}

export const createProduct = async (req, res, next) => {
    try {
        const { name, price, description } = req.body;

        // cek body kosong (lebih clean daripada Object.keys)
        if(!name && price === undefined && !description) {
            const err = new Error('Data tidak boleh kosong, pastikan name, price, dan description diisi');
            err.status = 400;
            throw err;
        }

        // cek field wajib
        if(!name || price === undefined || !description) {
            const err = new Error('Name, Price, dan Description wajib diisi');
            err.status = 400;
            throw err;
        }

        const parsedPrice = parseInt(price);

        // validasi tipe data
        if (
            (Number.isNaN(parsedPrice) || parsedPrice < 0 || price.toString().trim() === '') ||
            (typeof name !== 'string' || name.trim() === '') ||
            (typeof description !== 'string' || description.trim() === '')
        ) {
            const err = new Error('Price harus berupa angka positif, Name dan Description tidak boleh kosong');
            err.status = 400;
            throw err;
        }

        await createDataProduct({ name, price: parsedPrice, description });

        return res.status(201).json({
            message: "Product created successfully",
            data: req.body
        })
    } catch (err) {
        next(err);
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const result = await getProductDataById(id);

        return res.status(200).json({
            message: "Data found",
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export const deleteProductById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const result = await deleteProductDataById(id);

        return res.status(200).json({
            message: "Data deleted successfully",
            data: result
        });
    } catch (err) {
        next(err);
    }
}