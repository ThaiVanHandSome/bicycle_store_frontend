import { notification } from "antd";

const { createContext, useContext } = require("react");

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type, title, message) => {
        api[type]({
          message: title,
          description: message,
          showProgress: true,
          pauseOnHover: false,
          role: "status"
        });
      };
    return (
        <ToastContext.Provider value={openNotification}>
            {contextHolder}
            {children}
        </ToastContext.Provider>
    )
}