import { FC } from "react";
import Header from "../../components/Header";
import { TopBar } from "../../components/progress";

import "../css/progress_reviews.css";
interface IProgressPageProps {
    content: React.ReactNode;
}

const ProgressPage: FC<IProgressPageProps> = ({ content }) => {
    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />

            <div id='main'>
                <div id='contentWrapper'>
                    {/* <TopBar /> */}

                    <div>{content}</div>
                </div>
            </div>
        </>
    );
};

export default ProgressPage;
