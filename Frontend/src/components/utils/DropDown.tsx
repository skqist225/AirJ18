import { Dropdown, DropdownButton, FloatingLabel, Form, InputGroup } from 'react-bootstrap';
import { FieldValues, UseFormRegister } from 'react-hook-form';

export interface IDropDown {}

export default function DropDown({
    label,
    fieldName,
    register,
    errors,
}: {
    label: string;
    fieldName: string;
    register: UseFormRegister<FieldValues>;
    errors: {
        [x: string]: any;
    };
}) {
    return (
        <FloatingLabel label={label} style={{ marginBottom: '20px' }}>
            <Form.Select {...register(fieldName)}>
                <option value='MALE'>Nam</option>
                <option value='FEMALE'>Nữ</option>
                <option value='OTHER'>Khác</option>
            </Form.Select>
        </FloatingLabel>
    );
}
