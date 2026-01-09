import GeneratorHelper from '../utils/generator.helper';

/**
 * Generates a client-side API helper class string for a given database table.
 * This class provides methods to interact with the corresponding API endpoints (CRUD operations).
 * @param {string} tableName - The name of the database table (e.g., 'user_profiles').
 * @returns {string} A string containing the full TypeScript code for the API helper class.
 */
export function generateFunctions(tableName: string): string {
  const className = GeneratorHelper.snakeToPascal(tableName);
  return `
import FilterHelper from 'src/util/FilterHelper';
import type DataObject from 'src/models/DataObject';
import type { ${className}Model } from './model/${className}.model';
import type { BaseFunc, Filter, PageResult, RequestProps } from '../base/Base.func';
import ApiUtil from 'src/util/ApiUtil';

export default class ${className}Func implements BaseFunc<${className}Model, ${className}Model> {
  private static instance: ${className}Func;

  /**
   * Gets the singleton instance of the ${className}Func class.
   * @returns {${className}Func} The singleton instance.
   */
  public static getInstance(): ${className}Func {
    if (!${className}Func.instance) {
      ${className}Func.instance = new ${className}Func();
    }
    return ${className}Func.instance;
  }

  /**
   * Saves (creates or updates) a record.
   * It performs a PATCH request if data.id exists, otherwise a POST request.
   * @param {${className}Model} [data] - The data to be saved.
   * @returns {Promise<${className}Model>} A promise that resolves with the saved record.
   */
  async executeSave(data?: ${className}Model): Promise<${className}Model> {
    try {
      if (!data) return Promise.reject(new Error('No Data'));
      if (data.id) {
        await ApiUtil.patch<${className}Model | boolean>('url', data);
      } else {
        await ApiUtil.post<${className}Model>('url', data);
      }
      return Promise.resolve({} as ${className}Model);
    } catch (error) {
      console.error('${className}Func.executeSave.error - ' + JSON.stringify(error));
      return Promise.reject(new Error(JSON.stringify(error)));
    }
  }

  /**
   * Retrieves a paginated list of records from the API.
   * @param {RequestProps<${className}Model>} [req] - Request properties, including filters for the query.
   * @returns {Promise<PageResult<${className}Model>>} A promise that resolves with the paginated result.
   */
  async executeGet(req?: RequestProps<${className}Model>): Promise<PageResult<${className}Model>> {
    try {
      const filter = (req?.filter as Filter) || ({} as Filter);
      const url = 'url/page'; // Adjust URL as needed
      const params = { filter: FilterHelper.encodeFilter(filter) };

      const res = await ApiUtil.get<PageResult<${className}Model>>(url, { params });
      return Promise.resolve(res);
    } catch (error) {
      console.error('${className}Func.executeGet.error - ' + JSON.stringify(error));
      return Promise.reject(new Error(JSON.stringify(error)));
    }
  }

  /**
   * Deletes a record by its ID.
   * @param {${className}Model} [data] - The object containing the 'id' of the record to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if the deletion is successful.
   */
  async executeDelete(data?: ${className}Model): Promise<boolean> {
    try {
      if (!data || !data.id) return Promise.reject(new Error('No Data'));
      await ApiUtil.delete<boolean>('url', { data: { id: data.id } });
      return Promise.resolve(true);
    } catch (error) {
      console.error('${className}Func.executeDelete.error - ' + JSON.stringify(error));
      return Promise.reject(new Error(JSON.stringify(error)));
    }
  }
  
  /**
   * Generic execute method. Not implemented in this template.
   * @param {RequestProps<DataObject>} [req] - The request properties.
   * @returns {Promise<DataObject>} A promise that rejects, indicating the method is not implemented.
   */
  async execute(req?: RequestProps<DataObject>): Promise<DataObject> {
    console.log(req);
    return Promise.reject(new Error('Method not implemented.'));
  }
}
`;
}