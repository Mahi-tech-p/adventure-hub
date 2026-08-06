
export interface PaginationQueryDto{
    page? :number,
    limit? : number,
    search? :  string,

    sortBy? : string,
    order?: "asc" | "desc"

}