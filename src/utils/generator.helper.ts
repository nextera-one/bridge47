export default class GeneratorHelper {
  /**
   * Maps a MySQL column type to the corresponding TypeORM column type.
   * @param mysqlType - The MySQL column type string (e.g., 'varchar(255)', 'int', 'json')
   * @returns The TypeORM column type string
   */
  public static mapMysqlTypeToColumnType = (mysqlType: string): string => {
    const type = mysqlType.toLowerCase();
    
    // String types
    if (type.startsWith("varchar")) return "varchar";
    if (type === "longtext") return "longtext";
    if (type === "mediumtext") return "mediumtext";
    if (type.includes("text")) return "text";
    if (type.startsWith("char")) return "char";
    
    // Numeric types
    if (type.startsWith("bigint")) return "bigint";
    if (type.startsWith("tinyint(1)") || type === "boolean") return "boolean";
    if (type.startsWith("tinyint")) return "tinyint";
    if (type.startsWith("smallint")) return "smallint";
    if (type.startsWith("mediumint")) return "mediumint";
    if (type.includes("int")) return "int";
    if (type.startsWith("decimal")) return "decimal";
    if (type.startsWith("float")) return "float";
    if (type.startsWith("double")) return "double";
    
    // Date/Time types
    if (type === "date") return "date";
    if (type === "datetime") return "datetime";
    if (type.includes("timestamp")) return "timestamp";
    if (type === "time") return "time";
    if (type === "year") return "year";
    
    // Binary types
    if (type.startsWith("binary(16)")) return "binary";
    if (type.startsWith("binary")) return "binary";
    if (type === "longblob") return "longblob";
    if (type === "mediumblob") return "mediumblob";
    if (type.includes("blob")) return "blob";
    if (type === "varbinary") return "varbinary";
    
    // Special types
    if (type.startsWith("enum")) return "enum";
    if (type.startsWith("set")) return "set";
    if (type === "json") return "json";
    if (type === "bit") return "bit";
    
    // Spatial types
    if (type === "geometry") return "geometry";
    if (type === "point") return "point";
    if (type === "linestring") return "linestring";
    if (type === "polygon") return "polygon";

    return type;
  };

  /**
   * Maps a MySQL column type to the corresponding TypeScript type.
   * @param mysqlType - The MySQL column type string
   * @returns The TypeScript type string
   */
  public static mapMysqlTypeToTsType = (mysqlType: string): string => {
    const type = mysqlType.toLowerCase();
    
    switch (true) {
      // String types
      case type.includes("varchar"):
      case type.includes("text"):
      case type.includes("char"):
      case type === "longtext":
      case type === "mediumtext":
        return "string";
      
      // Numeric types (integers)
      case type.includes("bigint"):
        return "bigint"; // Use BigInt for large integers
      case type.includes("int"):
        return "number";
      
      // Numeric types (decimals)
      case type.includes("decimal"):
      case type.includes("float"):
      case type.includes("double"):
        return "number";
      
      // Date/Time types
      case type.includes("date"):
      case type.includes("time"):
      case type.includes("timestamp"):
        return "Date";
      
      // Boolean types
      case type.includes("boolean"):
      case type.startsWith("tinyint(1)"):
      case type.startsWith("bit"):
        return "boolean";
      
      // Binary types
      case type.startsWith("binary(16)"):
        return "string"; // UUID stored as binary
      case type.includes("blob"):
      case type.includes("binary"):
        return "Buffer";
      
      // JSON type
      case type === "json":
        return "Record<string, unknown>";
      
      // Set type
      case type.startsWith("set"):
        return "string[]";
      
      // Spatial types
      case type === "geometry":
      case type === "point":
      case type === "linestring":
      case type === "polygon":
        return "object";
      
      default:
        return "unknown";
    }
  };

  public static capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

  public static extractLength = (mysqlType: string): number | undefined => {
    const match = mysqlType.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : undefined;
  };

  public static extractEnumValues = (
    mysqlType: string
  ): string[] | undefined => {
    const match = mysqlType.match(/\(([^)]+)\)/);
    return match
      ? match[1].split(",").map((value) => value.trim().replace(/^'|'$/g, ""))
      : undefined;
  };

  public static snakeToPascal = (str: string): string => {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  };

  public static snakeToKebabCase = (str: string): string => {
    return str.replace(/_/g, "-");
  };

  public static pascalToSnakeCase = (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .toLowerCase();
  };

  //camelCase to snake_case
  public static camelToSnakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  };



  public static snakeToCamelCase = (
    str: string,
    toPascalCase: boolean = false
  ): string => {
    const words = str.split("_");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    if (toPascalCase) {
      return capitalizedWords.join("");
    }

    return (
      capitalizedWords[0].toLowerCase() + capitalizedWords.slice(1).join("")
    );
  };
}