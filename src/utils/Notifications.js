import { Message, Notification } from "element-ui";

class Notifications {
  static displayNotify(data, type, options = {}) {
    return Notification({
      ...options,
      type: type,
      message: data,
      showClose: true
    });
  }

  static displayMessage(data, type, options = {}) {
    return Message({
      ...options,
      type: type,
      message: data,
      showClose: true
    });
  }
}

export default Notifications;
