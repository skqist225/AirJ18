export default function getUserSex(sex: string) {
    return sex === 'MALE' ? 'Nam' : sex === 'FEMALE' ? 'Nữ' : 'Khác';
}
