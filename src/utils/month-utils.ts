/**
 * Month Utilities
 * Helper functions for month-related operations
 */

/**
 * Gets the current month in YYYY-MM format (using local timezone)
 */
export function getCurrentMonth(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Gets the previous month in YYYY-MM format (using local timezone)
 */
export function getPreviousMonth(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Checks if a month string is in valid YYYY-MM format
 */
export function isValidMonthFormat(month: string): boolean {
  return /^\d{4}-\d{2}$/.test(month);
}

/**
 * Formats a month string (YYYY-MM) to a human-readable format (e.g., "January 2024")
 */
export function formatMonth(month: string): string {
  if (!isValidMonthFormat(month)) {
    return month;
  }

  const [year, monthNum] = month.split("-");
  const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}
