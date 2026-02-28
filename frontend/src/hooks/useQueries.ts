import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Booking, type Status, type VehicleType, type Capacity, type ServiceType, type CleaningSubOption } from '../backend';

export function useGetBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookings'],
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
    queryKey: ['booking', id],
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateBookingParams) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createBooking(
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
      return params.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: Status }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateBookingStatus(id, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useAssignMechanic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, mechanicName }: { id: string; mechanicName: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.assignMechanic(id, mechanicName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
