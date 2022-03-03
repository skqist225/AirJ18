export function parseDBDate(str: string): Date {
    if (str.includes('T')) {
        str = str.split('T')[0];
    }

    var mdy = str.split('-');
    return new Date(parseInt(mdy[0]), parseInt(mdy[1]) - 1, parseInt(mdy[2]));
}

export default function datediff(first: number, second: number): number {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.abs(Math.ceil((second - first) / (1000 * 60 * 60 * 24)));
}
