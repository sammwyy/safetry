import { Result, safeTry } from '../src';

const waitFor = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

describe('safeTry', () => {
  it('should handle synchronous functions correctly', async () => {
    const [result, error]: Result<string, Error> = safeTry(() => {
      return 'Hello';
    });

    expect(result).toBe('Hello');
    expect(error).toBeNull();

    // Test error handling
    const [resultError, errorCaught] = safeTry(() => {
      throw new Error('This is an error');
    });

    expect(resultError).toBeNull();
    expect(errorCaught).toBeInstanceOf(Error);
    expect(errorCaught?.message).toBe('This is an error');
  });

  it('should handle asynchronous functions correctly', async () => {
    const [result, error] = await safeTry(async () => {
      await waitFor(50);
      return 'Hello';
    });

    expect(result).toBe('Hello');
    expect(error).toBeNull();

    // Test error handling
    const [resultError, errorCaught] = await safeTry(async () => {
      throw new Error('This is an error');
    });

    expect(resultError).toBeNull();
    expect(errorCaught).toBeInstanceOf(Error);
    expect(errorCaught?.message).toBe('This is an error');
  });

  it('should handle Promise objects correctly', async () => {
    const [result, error] = await safeTry(Promise.resolve('Hello'));

    expect(result).toBe('Hello');
    expect(error).toBeNull();

    // Test error handling
    const [resultError, errorCaught] = await safeTry(
      Promise.reject(new Error('This is an error')),
    );

    expect(resultError).toBeNull();
    expect(errorCaught).toBeInstanceOf(Error);
    expect(errorCaught?.message).toBe('This is an error');
  });
});
