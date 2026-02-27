import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RegistrationInput {
    password: string;
    name: string;
    email: string;
}
export interface UpdateProductInput {
    sku: string;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface Product {
    id: bigint;
    sku: string;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    isVisible: boolean;
    category: string;
    price: bigint;
}
export type Time = bigint;
export type Rating = bigint;
export interface AddProductInput {
    sku: string;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export type ProductId = bigint;
export interface ProductReviews {
    reviews: Array<Review>;
    averageRating?: Rating;
    reviewCount: bigint;
}
export type Error_ = {
    __kind__: "error";
    error: string;
};
export interface ReviewInput {
    title: string;
    body: string;
    author: string;
    rating: Rating;
}
export interface Review {
    id: bigint;
    title: string;
    body: string;
    author: string;
    timestamp: Time;
    rating: Rating;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(productInput: AddProductInput): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: Error_;
    }>;
    adminCheck(email: string, password: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(productId: bigint): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: Error_;
    }>;
    getAllProductAverageRatings(): Promise<Array<[ProductId, Rating | null]>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllProductsAdmin(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProductById(productId: bigint): Promise<Product | null>;
    getProductRatingSummary(productId: ProductId): Promise<ProductReviews | null>;
    getProductReviewCount(productId: ProductId): Promise<bigint>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getReviews(productId: ProductId): Promise<ProductReviews>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRole(user: Principal): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    loginUser(email: string, password: string): Promise<boolean>;
    registerUser(input: RegistrationInput): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitReview(productId: ProductId, reviewInput: ReviewInput): Promise<void>;
    updateProduct(productId: bigint, updateProductInput: UpdateProductInput): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: Error_;
    }>;
    updateProductVisibility(productId: bigint, visibility: boolean): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: Error_;
    }>;
}
