import { FloatingLabel, Form, FormControl, InputGroup } from 'react-bootstrap';
import { Control, Controller, FieldValues, UseFormRegister } from 'react-hook-form';

export interface IFormGroup {
    label: string;
    type: string;
    fieldName: string;
    placeholder?: string;
    register: UseFormRegister<FieldValues>;
    errors: {
        [x: string]: any;
    };
}

export default function FormGroup({
    label,
    type,
    fieldName,
    placeholder,
    register,
    errors,
}: IFormGroup) {
    return (
        <>
            {' '}
            <FloatingLabel label={label} className='mb-3'>
                <Form.Control type={type} placeholder={placeholder} {...register(fieldName)} />
            </FloatingLabel>
        </>
    );
}
