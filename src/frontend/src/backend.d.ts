import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: string;
    customerName: string;
    status: Status;
    vehicleType: VehicleType;
    serviceType: ServiceType;
    bikeBrand?: string;
    createdAt: bigint;
    bikeModel?: string;
    address: string;
    mechanicName?: string;
    repairDetails?: string;
    cleaningSubOption?: CleaningSubOption;
    capacity: Capacity;
    phoneNumber: string;
    timeSlot?: string;
}
export type CleaningSubOption = {
    __kind__: "normalFoamWashing";
    normalFoamWashing: bigint;
} | {
    __kind__: "colourFoamWashing";
    colourFoamWashing: bigint;
};
export enum Capacity {
    upTo200cc = "upTo200cc",
    above200cc = "above200cc"
}
export enum ServiceType {
    repair = "repair",
    fullService = "fullService",
    cleaning = "cleaning"
}
export enum Status {
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum VehicleType {
    motorcycle = "motorcycle",
    scooter = "scooter",
    electric = "electric"
}
export interface backendInterface {
    assignMechanic(id: string, mechanicName: string): Promise<void>;
    createBooking(id: string, customerName: string, phoneNumber: string, address: string, vehicleType: VehicleType, capacity: Capacity, serviceType: ServiceType, repairDetails: string | null, cleaningSubOption: CleaningSubOption | null, timeSlot: string | null, bikeBrand: string | null, bikeModel: string | null): Promise<void>;
    getBooking(id: string): Promise<Booking | null>;
    getBookings(): Promise<Array<Booking>>;
    updateBookingStatus(id: string, newStatus: Status): Promise<void>;
}
