import type DataObject from "src/models/DataObject";

export interface BaseModel extends DataObject {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  partner?: string;
  partner_data?: DataObject;
  log?: string;
  log_data?: DataObject;
}
