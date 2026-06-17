import { createContext, useContext, useState } from "react";

export type EventEmitter<TEvents extends string = string> = {
  emit: (event: TEvents, ...args: any[]) => void;
  /** Registers a listener and returns a function that removes it. */
  on: (event: TEvents, listener: (...args: any[]) => void) => () => void;
};

/** Creates a standalone event emitter instance. */
export const createEventEmitter = <
  TEvents extends string = string,
>(): EventEmitter<TEvents> => {
  const listeners = new Map<TEvents, Array<(...args: any[]) => void>>();

  return {
    emit: (event, ...args) => {
      listeners.get(event)?.forEach((listener) => listener(...args));
    },
    on: (event, listener) => {
      const forEvent = listeners.get(event) ?? [];
      forEvent.push(listener);
      listeners.set(event, forEvent);

      return () => {
        listeners.set(
          event,
          (listeners.get(event) ?? []).filter((l) => l !== listener),
        );
      };
    },
  };
};

export const EventEmitterContext = createContext<EventEmitter>(
  createEventEmitter(),
);
EventEmitterContext.displayName = "EventEmitterContext";

/** Returns the event emitter provided by the nearest EventEmitterContext. */
export const useEventEmitter = <
  TEvents extends string = string,
>(): EventEmitter<TEvents> =>
  useContext(EventEmitterContext) as EventEmitter<TEvents>;

/**
 * Returns a stable event emitter instance for the lifetime of the component.
 * Provide it via `EventEmitterContext.Provider` so descendants share it.
 */
export const useEventEmitterInstance = <
  TEvents extends string = string,
>(): EventEmitter<TEvents> => useState(() => createEventEmitter<TEvents>())[0];
