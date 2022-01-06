import { Dropdown, DropdownButton, InputGroup } from 'react-bootstrap';
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
        <InputGroup className='form-group'>
            <DropdownButton
                variant='outline-secondary'
                title={label}
                id='input-group-dropdown-1'
                {...register('sex')}
            >
                <Dropdown.Item value='MALE'>Nam</Dropdown.Item>
                <Dropdown.Item value='FEMALE'>Nữ</Dropdown.Item>
                <Dropdown.Item value='OTHER'>Khác</Dropdown.Item>
            </DropdownButton>
        </InputGroup>
    );
}
