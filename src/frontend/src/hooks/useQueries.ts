import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import type {
  Booking,
  Capacity,
  CleaningSubOption,
  ServiceType,
  Status,
  VehicleType,
} from "../backend";
import { useActor } from "./useActor";

export function useGetBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBooking(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Booking | null>({
    queryKey: ["booking", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getBooking(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export interface CreateBookingParams {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  vehicleType: VehicleType;
  capacity: Capacity;
  serviceType: ServiceType;
  repairDetails: string | null;
  cleaningSubOption: CleaningSubOption | null;
}

export function useCreateBooking() {
  const { actor } = useActor();
  // Keep a ref so the latest actor is always accessible inside the mutation callback
  const actorRef = useRef(actor);
  actorRef.current = actor;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateBookingParams) => {
      // If actor isn't ready yet, poll up to 5 seconds before giving up
      let resolvedActor = actorRef.current;
      if (!resolvedActor) {
        resolvedActor = await new Promise<typeof actor>((resolve) => {
          const deadline = Date.now() + 5000;
          const interval = setInterval(() => {
            if (actorRef.current) {
              clearInterval(interval);
              resolve(actorRef.current);
            } else if (Date.now() >= deadline) {
              clearInterval(interval);
              resolve(null);
            }
          }, 500);
        });
      }

      if (!resolvedActor) {
        throw new Error(
          "Service not ready yet. Please wait a moment and try again.",
        );
      }

      try {
        await resolvedActor.createBooking(
          params.id,
          params.customerName,
          params.phoneNumber,
          params.address,
          params.vehicleType,
          params.capacity,
          params.serviceType,
          params.repairDetails,
          params.cleaningSubOption,
        );
      } catch (err) {
        console.error("[useCreateBooking] createBooking call failed:", err);
        // Re-throw with a friendlier message that still includes root cause
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`Booking failed: ${message}`);
      }
      return params.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => {
      console.error("[useCreateBooking] mutation error:", err);
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: { id: string; newStatus: Status }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.updateBookingStatus(id, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useAssignMechanic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      mechanicName,
    }: { id: string; mechanicName: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.assignMechanic(id, mechanicName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
