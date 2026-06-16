import axios from "axios";
import { format, isValid, parseISO } from "date-fns";

const errorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return String(error);
};

export function toFormattedDate(
  dateString: string,
  formatStr: string,
): string | null {
  if (!dateString) return null;
  const date = parseISO(dateString);
  if (!isValid(date)) return null;
  return format(date, formatStr);
}
