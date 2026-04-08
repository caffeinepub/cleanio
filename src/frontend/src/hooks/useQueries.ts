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
  customerName: string;
  phoneNumber: string;
  address: string;
  vehicleType: VehicleType;
  capacity: Capacity;
  serviceType: ServiceType;
  repairDetails: string | null;
  cleaningSubOption: CleaningSubOption | null;
  timeSlot: string | null;
}

function generateBookingId(): string {
  return `BK-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function useCreateBooking() {
  const { actor } = useActor();
  // Keep a ref so the latest actor is always accessible inside the mutation callback
  const actorRef = useRef(actor);
  actorRef.current = actor;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateBookingParams): Promise<string> => {
      // If actor isn't ready yet, poll up to 10 seconds before giving up
      let resolvedActor = actorRef.current;
      if (!resolvedActor) {
        resolvedActor = await new Promise<typeof actor>((resolve) => {
          const deadline = Date.now() + 10000;
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

      // Generate a fresh booking ID per attempt so retries don't collide
      // with a previously-trapped (partial) write on the backend.
      let lastError: unknown;
      for (let attempt = 0; attempt < 3; attempt++) {
        const bookingId = generateBookingId();
        try {
          await resolvedActor.createBooking(
            bookingId,
            params.customerName,
            params.phoneNumber,
            params.address,
            params.vehicleType,
            params.capacity,
            params.serviceType,
            params.repairDetails,
            params.cleaningSubOption,
            params.timeSlot,
          );
          // Return the ID that was successfully stored
          return bookingId;
        } catch (err) {
          lastError = err;
          console.error(
            `[useCreateBooking] attempt ${attempt + 1} failed:`,
            err,
          );
          // Don't retry validation errors
          const message = err instanceof Error ? err.message : String(err);
          const isValidationError =
            message.includes("required") ||
            message.includes("Cleaning sub-option");
          if (isValidationError) break;
          // Wait before retry
          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
          }
        }
      }

      const message =
        lastError instanceof Error ? lastError.message : String(lastError);
      throw new Error(`Booking failed. Please try again. (${message})`);
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
