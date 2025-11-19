/**
 * Auto-Clear Expenses Utility
 *
 * Checks if expenses should be auto-cleared when a new month starts.
 * This can be called on app startup or when the user logs in.
 *
 * Note: This is an optional feature. The app will work fine without it,
 * but it can help maintain a clean state when transitioning to new months.
 */

import { getCurrentMonth, getPreviousMonth } from "./month-utils";

/**
 * Checks if auto-clearing should occur based on the last cleared month stored in localStorage.
 * Returns the month to clear if auto-clearing is needed, or null if not needed.
 *
 * @param userId User ID to scope the localStorage key
 * @returns Month to clear (YYYY-MM) or null if no clearing needed
 */
export function shouldAutoClearExpenses(userId: string): string | null {
  const currentMonth = getCurrentMonth();
  const lastClearedKey = `last-cleared-month-${userId}`;

  try {
    const lastClearedMonth = localStorage.getItem(lastClearedKey);

    // If we've never cleared before, don't auto-clear (user might have historical data)
    if (!lastClearedMonth) {
      return null;
    }

    // If we've already cleared for the current month, no need to clear again
    if (lastClearedMonth === currentMonth) {
      return null;
    }

    // If the last cleared month is before the current month, we should clear
    // This handles month transitions
    if (lastClearedMonth < currentMonth) {
      // Return the previous month to clear (the one we're leaving)
      return getPreviousMonth();
    }

    return null;
  } catch (error) {
    console.error("Error checking auto-clear status:", error);
    return null;
  }
}

/**
 * Marks a month as cleared in localStorage
 *
 * @param userId User ID
 * @param month Month that was cleared (YYYY-MM)
 */
export function markMonthAsCleared(userId: string, month: string): void {
  const lastClearedKey = `last-cleared-month-${userId}`;
  try {
    localStorage.setItem(lastClearedKey, month);
  } catch (error) {
    console.error("Error marking month as cleared:", error);
  }
}

/**
 * Clears the auto-clear tracking for a user (useful for testing or reset)
 *
 * @param userId User ID
 */
export function resetAutoClearTracking(userId: string): void {
  const lastClearedKey = `last-cleared-month-${userId}`;
  try {
    localStorage.removeItem(lastClearedKey);
  } catch (error) {
    console.error("Error resetting auto-clear tracking:", error);
  }
}
