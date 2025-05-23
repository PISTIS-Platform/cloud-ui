import type { UnwrapRef } from 'vue';

import type { SortOptions } from '~/interfaces/table';

export const useTable = <T>(data: Ref<T[] | null>, numOfItems: number = 10, defaultSort?: SortOptions) => {
    //Table data
    const rows = computed<T[]>(() => data.value || []);

    // page in paginated data
    const page = ref(1);

    //number of items per page
    const pageCount = ref(numOfItems);

    // Searchable string for search input
    const searchString = ref('');

    //default sorting
    const sortBy = ref<SortOptions | undefined>(defaultSort);

    //sort assets first before filtering and paginating
    const sortedRows = computed(() => {
        //if no default sorting is selected return results as they are
        if (!sortBy.value) {
            return rows.value;
        }

        return useSortRows<T>(rows.value as UnwrapRef<T>[], sortBy.value);
    });

    //filtered rows
    const filteredRows = computed(() => {
        if (!searchString.value) {
            return sortedRows.value;
        } else {
            return (sortedRows.value as T[]).filter((item: T) => {
                return Object.values(item as Record<string, unknown>).some((value: unknown) => {
                    return String(value).toLowerCase().includes(searchString.value.toLowerCase());
                });
            });
        }
    });

    //paginated rows
    const paginatedRows = computed(() => {
        const paginatedResults = getPaginatedRows(page.value);

        //get paginated results of previous page in case user deletes an item from the list
        //and there are results in general, but not in the current page after the deletion
        if (!paginatedResults.length && filteredRows.value.length && page.value !== 1) {
            return getPaginatedRows(page.value - 1);
        }

        return paginatedResults;
    });

    const getPaginatedRows = (pageNum: number) => {
        return filteredRows.value.slice((pageNum - 1) * pageCount.value, pageNum * pageCount.value);
    };

    return {
        page,
        sortBy,
        searchString,
        rows,
        filteredRows,
        paginatedRows,
        pageCount,
    };
};
