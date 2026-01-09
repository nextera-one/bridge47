/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TableColumn {
  /**
   * Unique id, identifies column, (used by pagination.sortBy, 'body-cell-[name]' slot, ...)
   */
  name: string;

  /**
   * Label for header
   */
  label: string;

  /**
   * Row Object property to determine value for this column
   * or function which maps to the required property
   * @param row The current row being processed
   * @returns Value for this column
   */
  field: string | ((row: any) => any);

  /**
   * If we use visible-columns, this col will always be visible
   */
  required?: boolean;

  /**
   * Horizontal alignment of cells in this column
   * Default value: 'right'
   */
  align?: 'left' | 'right' | 'center';

  /**
   * Tell QTable you want this column sortable
   * Default value: false
   */
  sortable?: boolean;

  /**
   * Compare function for sorting, excluding null/undefined values
   */
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;

  /**
   * Compare function for sorting, including null/undefined values
   */
  rawSort?: (a: any, b: any, rowA: any, rowB: any) => number;

  /**
   * Set column sort order: 'ad' (ascending-descending) or 'da' (descending-ascending)
   * Default value: 'ad'
   */
  sortOrder?: 'ad' | 'da';

  /**
   * Function you can apply to format your data
   */
  format?: (val: any, row: any) => any;

  /**
   * Style to apply on normal cells of the column
   */
  style?: string | ((row: any) => string);

  /**
   * Classes to add on normal cells of the column
   */
  classes?: string | ((row: any) => string);

  /**
   * Style to apply on header cells of the column
   */
  headerStyle?: string;

  /**
   * Classes to add on header cells of the column
   */
  headerClasses?: string;
}

import type { Component, VNodeChild } from 'vue';

export interface CellRenderCtx<Row = any> {
  row: Row;
  col: TableColumnEx<Row>;
  value: any;
  index: number;
}

export interface TableColumnEx<Row = any> extends TableColumn {
  /** Preferred: a component to render the cell */
  component?: Component; // receives props: { row, col, value, index }
  /** Or: a render function (for quick inline templates) */
  render?: (ctx: CellRenderCtx<Row>) => VNodeChild;
}

export type TableColumnsEx<Row = any> = TableColumnEx<Row>[];

export type TableColumns = TableColumn[] | undefined;
