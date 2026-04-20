import { getUsers, createUser, filterUser, deleteUserById, getUserById } from '../services/userServices.js';

export async function getUsersData(req, res, next) {
    try {
        const { page, limit, searchName, searchEmail } = req.query;

        const data = await getUsers({ page, limit, searchName, searchEmail });

        const filterData = data.result.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email
        }));

        // const data = await filterUser({ queryEmail, queryUsername, queryPage, queryLimit });

        return res.status(200).json({
            message: "Data Found",
            data: filterData,
            metadata: {
                total: data.total,
                page: data.page,
                totalPages: data.totalPages
            }
        })
    } catch (err) {
        next(err);
    }
}

export async function filterUsersData(req, res, next) {
    try {
        // filter query
        const { nama, alamat } = req.query;

        // validasi query
        const data = await filterUser({ nama, alamat })

        return res.status(200).json({
            message: data.message, data: data.resultQuery
        })
    } catch (err) {
        next(err);
    }
}

export async function createUserData(req, res, next) {
    try {
        const { email, nama, alamat, umur } = req.body;

        // cek body kosong (lebih clean daripada Object.keys)
        if(!email && !nama && !alamat && umur === undefined) {
            const err = new Error('Data tidak boleh kosong, pastikan email, nama, alamat, dan umur diisi');
            err.status = 400;
            throw err;
        }

        // cek field wajib
        if (!email || !nama || !alamat || umur === undefined) {
            const err = new Error('Email, Nama, Umur, dan Alamat wajib diisi');
            err.status = 400;
            throw err;
        }

        // validasi tipe data
        const parsedUmur = Number(umur);

        if (
            (Number.isNaN(parsedUmur) || parsedUmur < 0 || (typeof umur === 'string' && umur.trim() === ''))  ||
            (typeof nama === 'string' && nama.trim() === '') ||
            (typeof alamat === 'string' && alamat.trim() === '') ||
            (typeof email === 'string' && email.trim() === '')
        ) {
            const err = new Error('Format data salah: email/nama/alamat harus string, umur harus angka dan tidak boleh negatif, serta tidak boleh ada field yang hanya berisi spasi');
            err.status = 400;
            throw err;
        }

        // validasi format email sederhana
        if (!email.includes('@')) {
            const err = new Error("Format email salah, wajib menggunakan '@' ");
            err.status = 400;
            throw err;
        }

        // create user
        const newUser = await createUser({ email, nama, umur: parsedUmur, alamat });

        // response
        return res.status(201).json({
            message: "User created successfully",
            data: newUser
        })
    } catch (err) {
        next(err);
    }
}

export async function getUserDataById(req, res, next) {
    try {
        // parse id menjadi Integer
        const id = req.params.id;

        const result = await getUserById(id);
        const { idUser, name, email, created_at, updated_at } = result;

        // response
        return res.status(200).json({
            message: "Data Found",
            data: {
                id: idUser,
                name,
                email,
                created_at,
                updated_at
            }
        })

    } catch (err) {
        next(err);
    }
}

export async function deleteUserData(req, res, next) {
    try {
        // params id parse ke integer
        const id = parseInt(req.params.id);

        const data = await deleteUserById(id);

        // response
        return res.status(200).json({
            message: "Data Deleted",
            data: data
        })

    } catch (err) {
        next(err);
    }
}