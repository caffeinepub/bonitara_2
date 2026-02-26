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
export type Time = bigint;
export type Rating = bigint;
export type ProductId = bigint;
export interface ProductReviews {
    reviews: Array<Review>;
    averageRating?: Rating;
    reviewCount: bigint;
}
export interface ReviewInput {
    title: string;
    body: string;
    author: string;
    rating: Rating;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Review {
    id: bigint;
    title: string;
    body: string;
    author: string;
    timestamp: Time;
    rating: Rating;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminCheck(email: string, password: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllProductAverageRatings(): Promise<Array<[ProductId, Rating | null]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProductRatingSummary(productId: ProductId): Promise<ProductReviews | null>;
    getProductReviewCount(productId: ProductId): Promise<bigint>;
    getReviews(productId: ProductId): Promise<ProductReviews>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRole(user: Principal): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    loginUser(email: string, password: string): Promise<boolean>;
    registerUser(input: RegistrationInput): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitReview(productId: ProductId, reviewInput: ReviewInput): Promise<void>;
}
