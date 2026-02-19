import prisma from '../../utils/prisma';
import { brandInput } from './brand.schema';
import cloudinary from '../../utils/cloudinary'

export const getAllBrands = async () => {
    return await prisma.brands.findMany();
}


export const createBrand = async (data: brandInput, file: Express.Multer.File) => {
    const uploadLogo: any = {};


    try {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'Books-brand-logos',
        });
        uploadLogo.public_id = uploadResponse.public_id;
        uploadLogo.secure_url = uploadResponse.secure_url;
        const brand = await prisma.$transaction(async (x) => {
            const newBrand = await x.brands.create({
                data: { name: data.name, description: data.description, logo_url: uploadLogo.secure_url, slug: data.slug }
            });
            return newBrand;
        });
        return brand;

    } catch (error) {
        if (uploadLogo.public_id) {
            await cloudinary.uploader.destroy(uploadLogo.public_id);
        }
        throw new Error("UPLOAD_LOGO_FAILED");
    }

}

export const updateBrand = async (info: brandInput & { id: number }, file: Express.Multer.File) => {
    const uploadLogo: any = {};
    try {
        const existingBrand = await prisma.brands.findUnique({ where: { id: info.id } });
        if (!existingBrand) {
            throw new Error("NOT_FOUND_BRAND")
        }
        if (file) {
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = `data:${file.mimetype};base64,${b64}`;
            const uploadResponse = await cloudinary.uploader.upload(dataURI, {
                folder: 'Books-brand-logos',
            });
            uploadLogo.public_id = uploadResponse.public_id;
            uploadLogo.secure_url = uploadResponse.secure_url;
            const brand = await prisma.$transaction(async (x) => {
                const updatedBrand = await x.brands.update({
                    where: { id: info.id },
                    data: { name: info.name, description: info.description, logo_url: uploadLogo.secure_url, slug: info.slug }
                });
                return updatedBrand;
            });
            await cloudinary.uploader.destroy("Books-brand-logos/" + existingBrand?.logo_url!.split('/').slice(-1)[0].split('.')[0]);
            return brand;

        }
        const brand = await prisma.$transaction(async (x) => {
            const updatedBrand = await x.brands.update({
                where: { id: info.id },
                data: { name: info.name, description: info.description, logo_url: info.logo_url, slug: info.slug }
            });
            return updatedBrand;
        });
        return brand;
    } catch (error) {
        if (uploadLogo.public_id) {
            await cloudinary.uploader.destroy(uploadLogo.public_id);
        }
        throw error;
    }
}

export const deleteBrand = async (id: number) => {
    return await prisma.$transaction(async (x) => {
        const brand = await x.brands.findUnique({ where: { id } });
        if (!brand) {
            throw new Error("NOT_FOUND_BRAND")
        }
        if (brand?.logo_url) {
            const publicId = "Books-brand-logos/" + brand.logo_url.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await x.brands.delete({ where: { id } });
    });

}

