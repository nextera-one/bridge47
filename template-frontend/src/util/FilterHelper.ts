import StringUtil from './StringUtil';
import type { Filter, OrderBy, Pagination, Where } from 'src/func/base/Base.func';

export default class FilterHelper {
  public static initFilter = (
    filter: Filter,
    pagination?: Pagination,
    forcePagination?: boolean,
    // ignorePaginationCount?: boolean,
  ): Filter => {
    if (!filter) {
      filter = {} as Filter;
    }
    // filter.ignorePaginationCount = ignorePaginationCount
    if (pagination) {
      FilterHelper.setPagination(filter, pagination, forcePagination);
    }
    return filter;
  };

  public static addWhereCondition(filter: Filter, where: Where): Filter {
    if (!filter) {
      filter = {} as Filter;
    }
    if (!filter.where) {
      filter.where = [];
    }
    filter.where.push(where);

    return filter;
  }

  public static addOrderBy(filter: Filter, order_by?: OrderBy): Filter {
    if (!filter) {
      filter = {} as Filter;
    }
    if (order_by) {
      filter.order_by = order_by;
    }
    // if (!filter.order_by)
    if (!filter.order_by) {
      filter.order_by = {} as OrderBy;
    }
    return filter;
  }

  public static addWhereConditions(filter: Filter, where: Where[]): Filter {
    if (where) {
      where.forEach((w) => {
        filter = FilterHelper.addWhereCondition(filter, w);
      });
    }
    return filter;
  }

  public static addRelations(filter: Filter, relations: string[]): Filter {
    if (!filter) {
      filter = {} as Filter;
    }
    if (!filter.relations) {
      filter.relations = [];
    }
    if (relations) {
      relations.forEach((relation) => {
        if (filter.relations) filter.relations.push(relation);
      });
    }
    return filter;
  }

  public static setPagination(filter: Filter, pagination: Pagination, force?: boolean): Filter {
    if (!filter) {
      filter = {} as Filter;
    }
    if (force) {
      filter.page = pagination.page || 1;
      filter.limit = pagination.rowsPerPage || 10;
    } else {
      if (pagination.page) {
        filter.page = pagination.page;
      }
      if (pagination.rowsPerPage) {
        filter.limit = pagination.rowsPerPage;
      }
    }
    return filter;
  }

  public static encodeFilter(filter: Filter, log?: boolean): string {
    try {
      const encodedFilter = StringUtil.encodeBase64(JSON.stringify(filter));
      if (log) {
        console.log('encodedFilter', encodedFilter);
      }
      return encodedFilter;
    } catch (error) {
      console.error(error);
      return '';
    }
  }
}
