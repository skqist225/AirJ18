import { FloatingLabel, Form, FormControl, InputGroup } from 'react-bootstrap';
import { FieldValues, UseFormRegister } from 'react-hook-form';

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
            <FloatingLabel controlId='floatingInput' label={label} className='mb-3'>
                <Form.Control type={type} placeholder={placeholder} {...register(fieldName)} />
            </FloatingLabel>
            {/* {errors.fieldName && (
                <div className={errors?.fieldName && 'c-validation'}>
                    <span style={{ color: '#fff' }}>{errors?.fieldName.message}</span>
                </div>
            )} */}
        </>
    );
}
