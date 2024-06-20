import { useToast } from "~/context/ToastContext"

export const useTryCatch = () => {
    const openNotification = useToast();
    const handleTryCatch = async (callback) => {
        try {
            const res = await callback();
            return res;
        } catch (error) {
            console.log(error);
            if(error.response.data.status === 403) {
                if(!localStorage.getItem("accessToken")) {
                    openNotification("error", "Thông báo", "Bạn cần đăng nhập để thực hiện chức năng này!");
                } else {
                    openNotification("error", "Thông báo", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
                }
            } else {
                openNotification("error", "Thông báo", error.message);
            }
        }
    }
    return { handleTryCatch };
}