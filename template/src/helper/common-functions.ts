import axios from "axios";
import moment from "moment";

const errorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }
    return String(error);
};

export function toFormattedDate(
    dateString: string,
    format: string
): string | any {
    if (!dateString) { return null; }

    const date = moment(dateString);

    if (!date.isValid()) {
        return null;
    }

    return date.format(format);
}