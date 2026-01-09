import type DataObject from "src/models/DataObject";

/**
 * Defines the common properties shared across all data models.
 */
export interface BaseModel extends DataObject {
  /** The unique identifier (usually a UUID). */
  id?: string;
  /** Timestamp of when the record was created. */
  created_at?: Date;
  /** Timestamp of the last update to the record. */
  updated_at?: Date;
  /** ID of the user who created the record. */
  created_by?: string;
  /** ID of the user who last updated the record. */
  updated_by?: string;
  /** Identifier for a related partner or tenant. */
  partner?: string;
  /** Additional unstructured data related to the partner. */
  partner_data?: DataObject;
  /** A log message or identifier. */
  log?: string;
  /** Additional unstructured data for logging purposes. */
  log_data?: DataObject;
}
