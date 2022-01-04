import { FC } from 'react';
import { getImage } from '../../../helpers/getImage';
import { IRule } from '../../../type/type_RoomDetails';

export interface IRuleProps {
    rule: IRule;
}

const Rule: FC<IRuleProps> = ({ rule }) => {
    return (
        <div className='normal-flex' style={{ marginBottom: '8px' }} key={rule.title}>
            <img src={getImage(rule.icon)} alt='' width={'16px'} height={'16px'} />
            <span style={{ paddingLeft: '1.6rem', fontSize: '1.6rem' }}>{rule.title}</span>
        </div>
    );
};

export default Rule;