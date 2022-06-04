export default function makeGetURI(uri: string, fieldName: string, position: number) {
    let finalURI = uri;

    if (position === -1) {
        finalURI += fieldName;
    } else {
        const uris = uri.split("/").filter(value => value !== "");
        for (let i = uris.length; i >= position; i--) {
            uris[i + 1] = uris[i];
        }
        uris[position] = fieldName;
        finalURI = uris.join("/");
        console.log(finalURI);
    }

    return finalURI;
}
