import type { TableColumn } from '../types/index.js';
export interface TableOptions<T extends object> {
    columns: TableColumn<T>[];
    data: T[];
    /** Number of rows per page. 0 = no pagination. Default 0. */
    pageSize?: number;
    caption?: string;
}
/**
 * NNTable — generic typed sortable data table.
 *
 * @example
 * interface User { name: string; role: string; status: string }
 *
 * const table = new NNTable<User>(container, {
 *   columns: [
 *     { key: 'name', label: 'NAME', sortable: true },
 *     { key: 'role', label: 'ROLE' },
 *     { key: 'status', label: 'STATUS',
 *       render: (v) => v === 'active' ? '<span class="badge-safe">ONLINE</span>' : '—' },
 *   ],
 *   data: users,
 *   pageSize: 10,
 * });
 */
export declare class NNTable<T extends object> {
    private readonly root;
    private readonly columns;
    private data;
    private readonly pageSize;
    private _sortKey;
    private _sortDir;
    private _page;
    constructor(root: HTMLElement, opts: TableOptions<T>);
    /** Replace table data and re-render. */
    setData(data: T[]): void;
    private _sorted;
    private _paged;
    render(): void;
}
//# sourceMappingURL=nn-table.d.ts.map