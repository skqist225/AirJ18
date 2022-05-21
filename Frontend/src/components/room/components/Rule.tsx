import { FC } from "react";
import { Image } from "../../../globalStyle";
import { getImage } from "../../../helpers";
import { IRule } from "../../../types/room/type_RoomDetails";

export interface IRuleProps {
    rule: IRule;
}

const Rule: FC<IRuleProps> = ({ rule }) => {
    return (
        <div className='normal-flex' style={{ marginBottom: "8px" }} key={rule.title}>
            <Image src={getImage(rule.iconPath)} size='16px' />
            <span style={{ paddingLeft: "16px" }} className='fs-16'>
                {rule.title}
            </span>
        </div>
    );
};

export default Rule;
