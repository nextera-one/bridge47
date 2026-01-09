/**
 * Simple regex-based scanner for user-provided code to prevent common security pitfalls.
 * Throws an error if any forbidden pattern is found.
 *
 * NOTE: This is a basic scanner. For high-security, multi-tenant environments
 * where untrusted users can submit code, consider:
 * - A more robust static analysis (AST parser).
 * - Running code in isolated environments (e.g., separate containers, serverless functions).
 * - Imposing strict resource limits (CPU time, memory).
 */
const forbiddenPatterns: RegExp[] = [
  /\brequire\s*\(/, // Direct `require()` calls
  /\beval\s*\(/, // `eval()` calls
  /\bprocess\./, // Access to Node.js `process` object (e.g., `process.exit`, `process.env`)
  /\bchild_process\b/, // `child_process` module for spawning external processes
  /\bfs\./, // `fs` module for filesystem access
  /\bFunction\s*\(/, // `Function` constructor
  // Add more patterns as needed
  // /while\s*\(\s*true\s*\)/, // Infinite loop
  // /setTimeout\s*\([^,]+\s*,\s*0\)/, // Event loop blocking
];

export function scanCode(code: string): void {
  for (const re of forbiddenPatterns) {
    if (re.test(code)) {
      throw new Error(
        `Security violation: forbidden pattern "${re.source}" detected in custom code.`,
      );
    }
  }
}
