import { ForwardRefRenderFunction, forwardRef } from "react";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// forward refs
export function fr<T = HTMLElement, P = React.HTMLAttributes<T>>(
  component: ForwardRefRenderFunction<T, React.PropsWithoutRef<P>>,
) {
  const wrapped = forwardRef(component);
  wrapped.displayName = component.name;
  return wrapped;
}

// styled element
export function se<
  T = HTMLElement,
  P extends React.HTMLAttributes<T> = React.HTMLAttributes<T>,
>(Tag: keyof React.ReactHTML, ...classNames: ClassValue[]) {
  const component = fr<T, P>(({ className, ...props }, ref) => (
    // @ts-expect-error Too complicated for TypeScript
    <Tag ref={ref} className={cn(...classNames, className)} {...props} />
  ));
  component.displayName = Tag[0].toUpperCase() + Tag.slice(1);
  return component;
}

/**
 * Processes the given parameter using the provided function unless the parameter is "loading", `null`, or `undefined`.
 * If the parameter is "loading", `null`, or `undefined`, the function returns "skip" instead of calling the provided function.
 *
 * @template TInput - The type of the input parameter, which can include "loading", `null`, or `undefined`.
 * @template TCleanInput - The type of the input parameter after excluding "loading", `null`, and `undefined`.
 * @template TResult - The type of the result returned by the provided function.
 *
 * @param {TInput} param - The input parameter to be processed, which may be "loading", `null`, or `undefined`.
 * @param {(param: TValidInput) => TResult} argsFunc - The function to process the cleaned input parameter.
 * @returns {TResult | "skip"} - Returns the result of the provided function if the input is valid, otherwise returns "skip".
 *
 * @example
 * const result = skipIfUnset({ id: string }, (obj) => ({ id : obj.id })); // Returns new object based on input.
 * const result = skipIfUnset("loading", (obj) => ({ id : obj.id })); // Returns "skip".
 */
export function skipIfUnset<
  TInput,
  TValidInput extends Exclude<TInput, "loading" | undefined | null>,
  TOutput,
>(param: TInput, argsFunc: (param: TValidInput) => TOutput): TOutput | "skip" {
  if (param === "loading" || param == null) return "skip";
  return argsFunc(param as TValidInput);
}

/**
 * Checks if any of the provided parameters is "loading" or undefined.
 *
 * @param {...unknown[]} params - Any number of parameters to check.
 * @returns {boolean} - Returns true if any parameter is "loading" or undefined, false otherwise.
 *
 * @example
 * const isLoading = isAnyLoading("data", null, "loading", undefined); // Returns true
 * const isLoading = isAnyLoading("data", null, undefined); // Returns true
 * * const isLoading = isAnyLoading("data", null); // Returns false
 */
export function isAnyLoading(...params: unknown[]): boolean {
  if (params == null) return false;
  return params.some((p) => p === "loading" || p === undefined);
}

/**
 * Checks if any of the provided parameters is null.
 *
 * @param {...unknown[]} params - Any number of parameters to check.
 * @returns {boolean} - Returns true if any parameter is null, false otherwise.
 *
 * @example
 * const isEmpty = isAnyEmpty("data", null, "value"); // Returns true
 * const isEmpty = isAnyEmpty("data", undefined, "value"); // Returns false
 * const isEmpty = isAnyEmpty("data", "value"); // Returns false
 */
export function isAnyEmpty(...params: unknown[]): boolean {
  return params.some((p) => p === null);
}

/**
 * Splits an array into two arrays based on a filter function, with optional sorting.
 *
 * @template T - The type of elements in the array
 * @param {T[]} array - The input array to split
 * @param {(item: T) => boolean} filter - The filter function to determine which array each element goes into
 * @returns {[T[], T[]]} - A tuple containing [filtered items, remaining items]
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const [evens, odds] = splitArray(
 *   numbers,
 *   (n) => n % 2 === 0,
 * );
 */
export function splitArray<T>(
  array: T[],
  filter: (item: T) => boolean,
): [T[], T[]] {
  const filtered: T[] = [];
  const remaining = [...array];

  // Remove matching items from end to start to avoid index shifting
  for (let i = remaining.length - 1; i >= 0; i--) {
    if (filter(remaining[i])) {
      filtered.unshift(...remaining.splice(i, 1));
    }
  }

  return [filtered, remaining];
}
