import { FloatingLabel, Form } from 'react-bootstrap';
import { FieldValues, UseFormRegister } from 'react-hook-form';

export type IOption = {
    value: string;
    displayText: string;
};

export interface IDropDown {
    id?: string;
    label: string;
    defaultValue?: string;
    fieldName: string;
    options: IOption[];
    register: UseFormRegister<FieldValues>;
}

export default function DropDown({
    label,
    fieldName,
    register,
    options,
    defaultValue,
    id,
}: IDropDown) {
    return (
        <>
            {options.length && (
                <FloatingLabel label={label} style={{ margin: '20px 0' }}>
                    <Form.Select {...register(fieldName)} defaultValue={defaultValue} id={id}>
                        {options.map(({ value, displayText }) => (
                            <option value={value} key={value}>
                                {displayText}
                            </option>
                        ))}
                    </Form.Select>
                </FloatingLabel>
            )}
        </>
    );
}
