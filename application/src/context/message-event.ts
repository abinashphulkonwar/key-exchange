import { messageDBdb } from "../web-api/Index-db/messages";

const filed = document.getElementById("event");
if (!filed) throw new Error("No filed");

export const new_message_event = "new_message";

export const dispatch_event = (event: messageDBdb) => {
  filed.dispatchEvent(
    new CustomEvent(new_message_event, {
      detail: event,
    })
  );
};
type handler = (event: CustomEvent<messageDBdb>) => void;
let handler_ref: handler[] = [];
export const listen_event = (callback: handler) => {
  handler_ref.forEach((val) => {
    // @ts-ignore
    filed.removeEventListener(new_message_event, val);
  });
  handler_ref.push(callback);
  // @ts-ignore
  filed.addEventListener(new_message_event, callback);
};

export const remove_listener = (callback: handler) => {
  handler_ref = handler_ref.filter((val) => {
    if (val === callback) {
      return true;
    }
    return false;
  });
  // @ts-ignore
  filed.removeEventListener(new_message_event, callback);
};

export { filed };
