export type JSONValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | { [key: string]: JSONValue }
  | Array<Record<string, JSONValue>>
  | object
  | File
  | Blob
  | JSONValue[]
  | ((...args: unknown[]) => unknown); // Optional: if you expect functions too

export default interface DataObject {
  [key: string]: JSONValue;
}
