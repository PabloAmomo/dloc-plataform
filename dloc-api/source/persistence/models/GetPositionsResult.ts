import { Position } from "./Position";

export interface GetPositionsResult {
  results: Position[];
  error: Error | null;  
}