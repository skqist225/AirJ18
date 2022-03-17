export default function getPageNumber(pathname: string) {
    return parseInt(pathname.split('/').pop()! as string);
}
