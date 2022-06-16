export default function getImage(imageName: string) {
    return `${
        process.env.REACT_APP_NODE_ENV === "development"
            ? process.env.REACT_APP_LOCAL_SERVER_URL
            : process.env.REACT_APP_REMOTE_SERVER_URL
    }${imageName}`;
}
