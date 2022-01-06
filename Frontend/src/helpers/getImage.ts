export function getImage(imageName: string) {
    return `${process.env.REACT_APP_SERVER_URL}${imageName}`;
}
