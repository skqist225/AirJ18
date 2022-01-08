import { FloatingLabel, Form } from 'react-bootstrap';
import { FieldValues, UseFormRegister } from 'react-hook-form';

type IOption = {
    value: string;
    displayText: string;
};

export interface IDropDown {
    id?: string;
    name?: string;
    label: string;
    fieldName: string;
    options: IOption[];
    register: UseFormRegister<FieldValues>;
}

export default function DropDown({ label, fieldName, register, options }: IDropDown) {
    return (
        <FloatingLabel label={label} style={{ marginBottom: '20px' }}>
            <Form.Select {...register(fieldName)}>
                {options.map(({ value, displayText }) => (
                    <option value={value} title={displayText} key={value} />
                ))}
            </Form.Select>
        </FloatingLabel>
    );
}
