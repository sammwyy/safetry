import { wrapTry } from '../src';

const waitFor = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

function unsafeFunction(value: string): string {
  if (value === '') throw new Error('This is an error');
  return value.trim();
}

async function unsafeAsyncFunction(value: string): Promise<string> {
  await waitFor(50);
  if (value === '') throw new Error('This is an error');
  return value.trim();
}

function unsafePromiseFunction(value: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (value === '') reject(new Error('This is an error'));
    resolve(value.trim());
  });
}

describe('wrapTry', () => {
  it('should handle synchronous functions correctly', async () => {
    const safeFunction = wrapTry(unsafeFunction);
    const [result, error] = safeFunction(' Hello ');

    expect(result).toBe('Hello');
    expect(error).toBeNull();

    // Test error handling
    const [resultError, errorCaught] = safeFunction('');

    expect(resultError).toBeNull();
    expect(errorCaught).toBeInstanceOf(Error);
    expect(errorCaught?.message).toBe('This is an error');
  });

  it('should handle asynchronous functions correctly', async () => {
    const safeAsyncFn = wrapTry(unsafeAsyncFunction);
    const [result, error] = await safeAsyncFn(' Hello ');

    expect(result).toBe('Hello');
    expect(error).toBeNull();

    // Test error handling
    const [resultError, errorCaught] = await safeAsyncFn('');

    expect(resultError).toBeNull();
    expect(errorCaught).toBeInstanceOf(Error);
    expect(errorCaught?.message).toBe('This is an error');
  });

  it('should handle Promise objects correctly', async () => {
    const safePromiseFn = wrapTry(unsafePromiseFunction);
    const [result, error] = await safePromiseFn(' Hello ');

    expect(result).toBe('Hello');
    expect(error).toBeNull();

    // Test error handling
    const [resultError, errorCaught] = await safePromiseFn('');

    expect(resultError).toBeNull();
    expect(errorCaught).toBeInstanceOf(Error);
    expect(errorCaught?.message).toBe('This is an error');
  });
});
