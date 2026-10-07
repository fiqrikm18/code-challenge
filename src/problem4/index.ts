/**
 * Iterative
 *
 * Time: O(n)
 * Space: O(1)
 *
 * Straight forward and works for both positive and negative integers.
 */
function sum_to_n_a(n: number): number {
  const step = n >= 0 ? 1 : -1;
  let sum = 0;

  for (let i = step; step > 0 ? i <= n : i >= n; i += step) {
    sum += i;
  }

  return sum;
}

/**
 * Recursive
 *
 * Time: O(n)
 * Space: O(n) because of the call stack.
 *
 * More declarative, but less efficient for large values because
 * every number requires another recursive call.
 */
function sum_to_n_b(n: number): number {
  if (n === 0) {
    return 0;
  }

  if (n > 0) {
    return n + sum_to_n_b(n - 1);
  }

  return n + sum_to_n_b(n + 1);
}

/**
 * Arithmetic formula
 *
 * Time: O(1)
 * Space: O(1)
 *
 * Uses the formula:
 *
 *   1 + 2 + ... + n = n * (n + 1) / 2
 *
 * For negative n, the same formula also produces the expected
 * result, e.g. sum_to_n_c(-5) = -15.
 */
function sum_to_n_c(n: number): number {
  return (n * (n + 1)) / 2;
}