
export interface Product {
    id: number;
    title: string | null;
    sale_price: any;
    price: any;
    slug: string | null;
    discount_percent: number | null;
    BookImages: { url: string | null }[];
}
