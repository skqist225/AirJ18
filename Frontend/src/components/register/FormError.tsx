import { FC } from 'react';

interface IFormErrorProps {
    message: string;
}

const FormError: FC<IFormErrorProps> = ({ message }) => {
    return (
        <div className='c-validation'>
            <span style={{ color: '#fff' }}>{message}</span>
        </div>
    );
};

export default FormError;
