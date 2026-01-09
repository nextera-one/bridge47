export default class ArrayUtil {
  public static isNullOrUndefined(args: any): boolean {
    return args === null || args === undefined;
  }

  public static isEmpty(args: any[]): boolean {
    return ArrayUtil.isNullOrUndefined(args) || args.length === 0;
  }

  public static isNotEmpty(args: any[]): boolean {
    return !ArrayUtil.isEmpty(args);
  }

  public static isNotUndefined(args: any[]): boolean {
    return !ArrayUtil.isUndefined(args);
  }

  public static isUndefined(args: any[]): boolean {
    return args === undefined;
  }

  public static isNull(args: any[]): boolean {
    return args === null;
  }

  public static isNotNull(args: any[]): boolean {
    return !ArrayUtil.isNull(args);
  }

  public static isNotUndefinedOrNull(args: any[]): boolean {
    return !ArrayUtil.isUndefinedOrNull(args);
  }

  public static isUndefinedOrNull(args: any[]): boolean {
    return ArrayUtil.isUndefined(args) || ArrayUtil.isNull(args);
  }

  public static isNotNullOrUndefined(args: any[]): boolean {
    return !ArrayUtil.isNullOrUndefined(args);
  }

  public static isNullOrUndefinedOrEmpty(args: any[]): boolean {
    return ArrayUtil.isNullOrUndefined(args) || ArrayUtil.isEmpty(args);
  }

  public static isNotNullOrUndefinedOrEmpty(args: any[]): boolean {
    return !ArrayUtil.isNullOrUndefinedOrEmpty(args);
  }

  public static isNotUndefinedOrEmpty(args: any[]): boolean {
    return !ArrayUtil.isUndefinedOrEmpty(args);
  }

  public static isUndefinedOrEmpty(args: any[]): boolean {
    return ArrayUtil.isUndefined(args) || ArrayUtil.isEmpty(args);
  }

  public static isNullOrEmpty(args: any[]): boolean {
    return ArrayUtil.isNullOrUndefined(args) || ArrayUtil.isEmpty(args);
  }

  public static isNotNullOrEmpty(args: any[]): boolean {
    return !ArrayUtil.isNullOrEmpty(args);
  }

  public static chooseRandomFromArray(arr: any[]): any {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  public static removeDuplicates(arr: (string | number)[]): string[] {
    return arr.filter((item): item is string => typeof item === 'string');
  }

  //   arr.reduce((accumulator: string[], current: string) => {
  //     if (!accumulator.includes(current)) {
  //         accumulator.push(current);
  //     }
  //     return accumulator;
  // }, []);

  public static removeDuplicatesByProperty(
    arr: any[],
    property: string,
  ): any[] {
    return arr.filter(
      (item, index) =>
        arr.findIndex((obj) => obj[property] === item[property]) === index,
    );
  }

  public static removeDuplicatesByProperties(
    arr: any[],
    properties: string[],
  ): any[] {
    return arr.filter((item, index) => {
      const itemProperties = properties.map((property) => item[property]);
      return (
        arr.findIndex((obj) =>
          properties.every(
            (prop) => obj[prop] === itemProperties[properties.indexOf(prop)],
          ),
        ) === index
      );
    });
  }

  public static removeDuplicatesByPropertiesAndProperty(
    arr: any[],
    properties: string[],
    property: string,
  ): any[] {
    return arr.filter((item, index) => {
      const itemProperties = properties.map((property) => item[property]);
      return (
        arr.findIndex(
          (obj) =>
            properties.every(
              (prop) => obj[prop] === itemProperties[properties.indexOf(prop)],
            ) && obj[property] === item[property],
        ) === index
      );
    });
  }
}
