import { FC } from 'react';

interface IUserEditErrorProps {
    id: string;
}

export const UserEditError: FC<IUserEditErrorProps> = ({ id }) => {
    return (
        <div className='c-validation hidden'>
            <span className='errorMessage' id={id}></span>
        </div>
    );
};
