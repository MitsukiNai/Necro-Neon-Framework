// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-table component
// Typed, sortable data table with XSS-safe rendering
// ================================================================
import { escapeHtml } from '../security/index.js';
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
export class NNTable {
    constructor(root, opts) {
        this._sortKey = null;
        this._sortDir = 'asc';
        this._page = 0;
        this.root = root;
        this.columns = opts.columns;
        this.data = [...opts.data];
        this.pageSize = opts.pageSize ?? 0;
        this.root.className = 'nn-table-wrapper';
        this.render();
    }
    /** Replace table data and re-render. */
    setData(data) {
        this.data = [...data];
        this._page = 0;
        this.render();
    }
    _sorted() {
        if (!this._sortKey)
            return this.data;
        const key = this._sortKey;
        const dir = this._sortDir === 'asc' ? 1 : -1;
        return [...this.data].sort((a, b) => {
            const av = a[key];
            const bv = b[key];
            if (av === bv)
                return 0;
            return (av < bv ? -1 : 1) * dir;
        });
    }
    _paged(sorted) {
        if (!this.pageSize)
            return sorted;
        const start = this._page * this.pageSize;
        return sorted.slice(start, start + this.pageSize);
    }
    render() {
        this.root.innerHTML = '';
        const table = document.createElement('table');
        table.className = 'nn-table';
        table.setAttribute('role', 'table');
        // Caption
        // Header
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        this.columns.forEach((col) => {
            const th = document.createElement('th');
            th.textContent = escapeHtml(col.label);
            th.setAttribute('scope', 'col');
            if (col.sortable) {
                th.className = 'sortable';
                th.tabIndex = 0;
                if (this._sortKey === col.key) {
                    th.setAttribute('aria-sort', this._sortDir === 'asc' ? 'ascending' : 'descending');
                    th.textContent += this._sortDir === 'asc' ? ' ▲' : ' ▼';
                }
                const handler = () => {
                    if (this._sortKey === col.key) {
                        this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
                    }
                    else {
                        this._sortKey = col.key;
                        this._sortDir = 'asc';
                    }
                    this.render();
                };
                th.addEventListener('click', handler);
                th.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handler();
                    }
                });
            }
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
        // Body
        const tbody = document.createElement('tbody');
        const sorted = this._sorted();
        const paged = this._paged(sorted);
        paged.forEach((row) => {
            const tr2 = document.createElement('tr');
            this.columns.forEach((col) => {
                const td = document.createElement('td');
                if (col.render) {
                    // render() is developer-provided — must return safe HTML
                    td.innerHTML = col.render(row[col.key], row);
                }
                else {
                    td.textContent = escapeHtml(String(row[col.key] ?? ''));
                }
                tr2.appendChild(td);
            });
            tbody.appendChild(tr2);
        });
        if (paged.length === 0) {
            const tr3 = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = this.columns.length;
            td.textContent = 'NO DATA';
            td.className = 'nn-table-empty';
            tr3.appendChild(td);
            tbody.appendChild(tr3);
        }
        table.appendChild(tbody);
        this.root.appendChild(table);
        // Pagination
        if (this.pageSize && sorted.length > this.pageSize) {
            const totalPages = Math.ceil(sorted.length / this.pageSize);
            const nav = document.createElement('div');
            nav.className = 'nn-table-pagination';
            const prev = document.createElement('button');
            prev.type = 'button';
            prev.className = 'nn-btn btn-ghost btn-sm';
            prev.textContent = '◀ PREV';
            prev.disabled = this._page === 0;
            prev.addEventListener('click', () => { this._page--; this.render(); });
            const info = document.createElement('span');
            info.className = 'nn-mono nn-micro';
            info.textContent = `${this._page + 1} / ${totalPages}`;
            const next = document.createElement('button');
            next.type = 'button';
            next.className = 'nn-btn btn-ghost btn-sm';
            next.textContent = 'NEXT ▶';
            next.disabled = this._page >= totalPages - 1;
            next.addEventListener('click', () => { this._page++; this.render(); });
            nav.appendChild(prev);
            nav.appendChild(info);
            nav.appendChild(next);
            this.root.appendChild(nav);
        }
    }
}
//# sourceMappingURL=nn-table.js.map