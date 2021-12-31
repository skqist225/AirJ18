export function getImage(imagePath: string | undefined) {
    return `${process.env.REACT_APP_SERVER_URL}${imagePath}`;
}
