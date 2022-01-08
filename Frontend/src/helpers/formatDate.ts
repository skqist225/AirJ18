export default function formatDate(date: string) {
    return `${date.split('-')[2]} tháng ${date.split('-')[1]} năm ${date.split('-')[0]}`;
}
