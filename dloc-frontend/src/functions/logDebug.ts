import { config } from "config/config";

const logDebug = (message: string, objDebug?: any) => {
  if (!config.debug) return;
  console.log("[DEBUG] --> ", message);
  if (objDebug) { console.log(objDebug); }
}

export default logDebug;