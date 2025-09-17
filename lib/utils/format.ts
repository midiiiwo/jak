export const formatCurrency = (amount: number): string => {
    return `GHC ${amount.toLocaleString()}`;
};

export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date: string | Date): string => {
    return new Date(date).toLocaleString();
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
