import { useActor as useActorBase } from "@caffeineai/core-infrastructure";
import { type backendInterface, createActor } from "../backend";

/**
 * Returns the backend actor instance and its loading state.
 * Wraps the infrastructure useActor with the project's createActor function.
 */
export function useActor(): {
  actor: backendInterface | null;
  isFetching: boolean;
} {
  const { actor, isFetching } = useActorBase(
    createActor as Parameters<typeof useActorBase>[0],
  );
  return {
    actor: actor as backendInterface | null,
    isFetching,
  };
}
