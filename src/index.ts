// Main result type that will be returned as a tuple [Success, Error]
export type Result<T, E> = [T | null, E | null];

// Type for handling results
export type SafeHandler<T, E = Error> = (args: any) => Result<T, E>;

/**
 * safeTry
 * Directly executes a function or block of code inside error handling.
 * Useful for quickly evaluating synchronous functions or blocks of code.
 *
 * @param fn - The function to execute (synchronous) or return a Promise.
 * @returns A tuple [result, error] where result is the successful return value, or error is the caught error.
 *
 * @example
 * // For a quick inline function:
 * const [result, error] = safeTry(() => {
 *   throw new Error("This is an error");
 * });
 *
 * if (error) {
 *   console.error(error.message);
 * } else {
 *   console.log(result);
 * }
 */
export function safeTry<T>(fn: () => T): Result<T, Error>;

export function safeTry<T>(fn: () => Promise<T>): Promise<Result<T, Error>>;

export function safeTry<T>(fn: Promise<T>): Promise<Result<T, Error>>;

export function safeTry<T>(
  fn: (() => T) | (() => Promise<T>) | Promise<T>,
): Result<T, Error> | Promise<Result<T, Error>> {
  if (fn instanceof Promise) {
    return fn.then(
      (result) => [result, null] as Result<T, Error>,
      (error) => [null, error as Error] as Result<T, Error>,
    );
  } else {
    try {
      const result = fn();
      if (result instanceof Promise) {
        return result.then(
          (value) => [value, null] as Result<T, Error>,
          (error) => [null, error as Error] as Result<T, Error>,
        );
      } else {
        return [result, null] as Result<T, Error>;
      }
    } catch (error) {
      return [null, error as Error] as Result<T, Error>;
    }
  }
}

/**
 * wrapTry
 * Wraps a function to handle errors similarly to safeTry.
 * This function can wrap synchronous functions, asynchronous functions,
 * or functions returning a Promise.
 *
 * @param fn - The function to wrap (synchronous or asynchronous).
 * @returns A function that returns a tuple [result, error] where result is
 * the successful return value, or error is the caught error.
 *
 * @example
 * function unsafeFunction() {
 *   throw new Error("This is an error");
 * }
 *
 * const safeFunction = wrapTry(unsafeFunction);
 * const [result, error] = safeFunction();
 *
 * if (error) {
 *   console.error(error.message);
 * } else {
 *   console.log(result);
 * }
 */
export function wrapTry<T>(fn: (...args: any[]) => T): SafeHandler<T, Error>;

export function wrapTry<T>(
  fn: (...args: any[]) => Promise<T>,
): (...args: Parameters<typeof fn>) => Promise<Result<T, Error>>;

export function wrapTry<T>(
  fn: (...args: any[]) => T | Promise<T>,
): (
  ...args: Parameters<typeof fn>
) => Result<T, Error> | Promise<Result<T, Error>> {
  return (...args: Parameters<typeof fn>) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.then(
          (value) => [value, null] as Result<T, Error>,
          (error) => [null, error as Error] as Result<T, Error>,
        );
      } else {
        return [result, null] as Result<T, Error>;
      }
    } catch (error) {
      return [null, error as Error] as Result<T, Error>;
    }
  };
}
