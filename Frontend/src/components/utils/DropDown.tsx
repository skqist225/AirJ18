import { FloatingLabel, Form } from 'react-bootstrap';
import { FieldValues, UseFormRegister } from 'react-hook-form';

export type IOption = {
    value: string;
    displayText: string;
};

export interface IDropDown {
    id?: string;
    name?: string;
    label: string;
    defaultValue?: string;
    fieldName: string;
    options: IOption[];
    register: UseFormRegister<FieldValues>;
}

export default function DropDown({ label, fieldName, register, options, defaultValue }: IDropDown) {
    console.log(options);

    return (
        <FloatingLabel label={label} style={{ marginBottom: '20px' }}>
            <Form.Select {...register(fieldName)} defaultValue={defaultValue}>
                {options.map(({ value, displayText }) => (
                    <option value={value} key={value}>
                        {displayText}
                    </option>
                ))}
            </Form.Select>
        </FloatingLabel>
    );
}
