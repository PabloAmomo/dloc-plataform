import { printMessage } from "../../functions/printMessage";

const handleClose = (remoteAddress:string) => {
  printMessage(`(${remoteAddress}) connection closed.`);
};

export default handleClose;