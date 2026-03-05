import * as relatedRepo from './related.repositories';

export const getRelatedProducts = async (id: number) => {
    return await relatedRepo.productRelated(id);
}