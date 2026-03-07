import { nowInSec } from "@lib/core/helpers";

interface AppConstants {
  ACCESS_TOKEN_EXPIRY: number;
  DEFAULT_PAGE_LIMIT: number;
}

export const appConstants: AppConstants = {
  ACCESS_TOKEN_EXPIRY: nowInSec() + 60 * 60 * 24,
  DEFAULT_PAGE_LIMIT: 10,
};
