export default interface TableColumn {
    key: string;
    label: string;
    direction?: 'asc' | 'desc';
    class?: string;
    sortable?: boolean;
}
