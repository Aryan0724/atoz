/**
 * Wraps a promise or Thenable in a timeout race.
 * @param promise The promise-like object to execute (e.g. a Supabase query)
 * @param ms Timeout in milliseconds (default 5000)
 * @param timeoutError Error message if timeout occurs
 */
export async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number = 5000,
  timeoutError: string = 'Operation timed out'
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(timeoutError)), ms);
  });

  // Ensure standard promise behavior for the input
  const standardPromise = Promise.resolve(promise);

  return Promise.race([standardPromise, timeoutPromise]);
}
