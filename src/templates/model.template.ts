import GeneratorHelper from "../utils/generator.helper";

/**
 * Generates the string content for a client-side TypeScript model interface
 * based on a database table's schema. It also generates any necessary enums.
 *
 * @param {string} tableName - The snake_case name of the database table.
 * @param {{ name: string; type: string; nullable: boolean }[]} columns - An array of objects describing the table's columns.
 * @returns {string} The complete string content for the model file.
 */
export function generateModel(
  tableName: string,
  columns: { name: string; type: string; nullable: boolean }[],
): string {
  const enums = createEnums(tableName, columns);
  let model = `
  import type { BaseModel } from "../../base/Base.model";

export interface ${GeneratorHelper.snakeToPascal(tableName)}Model extends BaseModel{`;

  // Process and add properties for each column not handled by the BaseModel.
  columns.forEach((col) => {
    if (
      ![
        "id",
        "created_at",
        "created_by",
        "updated_at",
        "updated_by",
        "partner",
        "partner_data",
        "log",
        "log_data",
      ].includes(col.name)
    ) {
      let type = GeneratorHelper.mapMysqlTypeToTsType(col.type);
      // If the column is an enum, use the generated enum's name as the type.
      if (col.type.toLowerCase().includes("enum"))
        type = `${GeneratorHelper.snakeToPascal(col.name)}Enum`;
      model += `${col.name} ${col.nullable ? "?" : ""}: ${type};`;
    }
  });
  model += "}\n";

  // Append any generated enum definitions to the end of the file.
  if (enums.size > 0) model += [...enums.values()].join("\n");

  // Conditionally add DataObject import if it's used as a type.
  if(model.includes('DataObject')){
    model = `import type DataObject from 'src/models/DataObject';\n${model}`
  }
  return model;
};

/**
 * A helper function to create TypeScript enum definitions from database columns of type 'enum'.
 *
 * @param {string} tableName - The name of the database table (for context).
 * @param {{ name: string; type: string; nullable: boolean }[]} columns - An array of column schema objects.
 * @returns {Map<string, string>} A map where the key is the column name and the value is the string definition of the TypeScript enum.
 */
const createEnums = (
  tableName: string,
  columns: { name: string; type: string; nullable: boolean }[],
): Map<string, string> => {
  const enums: Map<string, string> = new Map();
  columns.forEach((col) => {
    if (col.type.includes("enum")) {
      // Extract enum values from the schema string, e.g., "enum('a','b','c')".
      const enumValues = col.type
        .slice(5, -1) // Remove 'enum(' and ')'
        .split(",") // Split by commas
        .map((value) => value.replace(/'/g, "").trim());

      let enumValue = "";
      enumValue += `\n export enum ${GeneratorHelper.snakeToPascal(col.name)}Enum {`;
      enumValues.forEach((value) => {
        // Convert the string value to a valid TypeScript enum key (e.g., "one-to-one" -> "ONE_TO_ONE").
        enumValue += `  ${value
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, "_")
          .replace(/^(\d)/, "_$1")} = '${value}',`;
      });
      enumValue += "}\n";
      enums.set(col.name, enumValue);
    }
  });
  return enums;
};