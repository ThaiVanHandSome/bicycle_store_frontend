import { Form, Formik } from "formik";
import ButtonCustom from "~/components/ButtonCustom";
import { MyPasswordInp } from "~/components/Form/FormItem";
import * as Yup from 'yup';
import { useTryCatch } from "~/hooks/useTryCatch";
import { updatePassword } from "~/services/apiServices/UserService";
import { useOverlay } from "~/context/OverlayContext";
import { useToast } from "~/context/ToastContext";

function ChangePassword() {
    const openNotification = useToast();
    const [openOverlay, hideOverlay] = useOverlay();
    const {handleTryCatch} = useTryCatch();

    return (
        <section className="py-6">
            <h1 className="font-bold text-xl mb-4">Thay đổi mật khẩu</h1>
            <section className="w-1/2">
                <Formik
                    initialValues={{newPassword: "", newPasswordAgain: ""}}
                    validationSchema={Yup.object({
                        newPassword: Yup.string()
                            .required("Bạn phải nhập trường này!")
                            .matches(
                                /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^A-Za-z0-9]).{6,})\S$/,
                                "Bạn phải nhập mật khẩu hợp lệ! Mật khẩu phải dài ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
                            ),
                            newPasswordAgain:Yup.string()
                            .required("Bạn phải nhập trường này!")
                            .oneOf([Yup.ref('newPassword'), null], "Mật khẩu không khớp!")
                    })}
                    onSubmit={async (values) => {
                        await handleTryCatch(async () => {
                            openOverlay();
                            const res = await updatePassword(values.newPassword);
                            hideOverlay();
                            if(res.status === "success") {
                                openNotification("success", "Thông báo", res.message);
                                return;
                            }
                            openNotification("error", "Thông báo", res.message);
                        })
                    }}
                >
                    <Form>  
                        <MyPasswordInp label="Mật khẩu mới" name="newPassword"/>
                        <MyPasswordInp label="Nhập lại mật khẩu mới" name="newPasswordAgain"/>
                        <ButtonCustom type="submit" radius="lg" className="mt-3">Cập nhật</ButtonCustom>
                    </Form>
                </Formik>
            </section>
        </section>
    );
}

export default ChangePassword;