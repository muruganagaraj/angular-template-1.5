/**
 * Representation of a date in the view model.
 */
type ViewModelDate = string;

/**
 * Interface representing the basic search criteria.
 */
interface SearchCriteria {
    page?: number;
    pageSize?: number;
    sortOrder?: SortOrder;
    sortField?: string;
}

/**
 * Interface representing a generic search resultset.
 */
interface SearchResults<T> {
    count: number;
    items: T[];
}

interface ServerFieldMapping {
    client: string;
    server: string;
}
