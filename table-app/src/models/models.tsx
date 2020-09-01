export interface InputProps {
    inputWidth: number;
}

export interface TableColumns {
    name: string;
    width: number;
}

export interface TableData {
    [key: string]: string | number;
}

export interface BoundingBoxes {
    [key: number]: DOMRect;
}

export interface RowRefs {
    [key: number]: HTMLTableRowElement;
}

export type SortType = 'asc' | 'desc';

export interface SortOption {
    [key:string]: SortType;
}

export interface TableProps {
    columns: TableColumns[];
    data: TableData[];
}