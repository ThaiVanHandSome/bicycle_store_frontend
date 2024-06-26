import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import ButtonCustom from "~/components/ButtonCustom";
import { MyPasswordInp, MyTextInp } from "~/components/Form/FormItem";
import routes from "~/config/routes";
import { useOverlay } from "~/context/OverlayContext";
import { useAuth } from "~/context/RefreshTokenContext";
import { useToast } from "~/context/ToastContext";
import { authenticate } from "~/services/apiServices/AuthService";
import { useTryCatch } from "~/hooks/useTryCatch";
import { useDispatch } from "react-redux";
import { fetchCart } from "~/store/actions/cartAction";
import { fetchUser } from "~/store/actions/userAction";

function Login() {

    // const dispatch = useDispatch();

    const openNotification = useToast();
    const [openOverlay, hideOverlay] = useOverlay();
    const [startRefreshToken, stopRefreshToken] = useAuth();

    const {handleTryCatch} = useTryCatch();

    return (<section className="relative px-24 py-6">
        <section className="rounded-xl px-6 py-2 shadow-lg flex">
            <div className="w-1/2 hidden lg:block">
                <img alt="bicycle-bg" src={require("~/assets/images/sliders/slider-02.png")} className="w-full"/>
            </div>
            <div className="ms-10 flex-1">
                <h1 className="text-5xl font-bold text-pri text-center mb-4">Đăng nhập</h1>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={Yup.object({
                        email: Yup.string()
                            .required("Bạn phải nhập trường này!")
                            .email("Email không hợp lệ!"),
                        password: Yup.string()
                            .required("Bạn phải nhập trường này!")
                            .matches(
                                /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^A-Za-z0-9]).{6,})\S$/,
                                "Bạn phải nhập mật khẩu hợp lệ! Mật khẩu phải dài ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
                            ),
                    })}
                    onSubmit={ async (values) => {
                        await handleTryCatch(async () => {
                            const data = {
                                email: values.email,
                                password: values.password
                            }
                            openOverlay();
                            const res = await authenticate(data);
                            hideOverlay();
                            if(res === null) {
                                openNotification("error", "Thông báo", "Email or Password Wrong!");
                            }
                            if(res.status === "success") {
                                localStorage.setItem("accessToken", res.data.accessToken);
                                localStorage.setItem("refreshToken", res.data.refreshToken);
                                // dispatch(fetchCart());
                                // dispatch(fetchUser());
                                // openNotification("success", "Thông báo", res.message);
                                startRefreshToken();
                                window.location.href = "https://bicycle-store-frontend.vercel.app";
                                return;
                            }
                            openNotification("error", "Thông báo", res.message);
                        });
                    }}
                >
                    <Form>
                        <MyTextInp label="Email" placeholder="Nhập email của bạn" name="email"/>
                        <MyPasswordInp label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" name="password"/>
                        <div className="flex items-center justify-between flex-row lg:flex-col xl:flex-row">
                            <p className="text-sm">Bạn chưa có tài khoản? <Link to={routes.register} className="font-bold text-sky-500">Đăng ký</Link></p>
                            <Link to={routes.fotgotPassword} className="text-sm font-bold text-sky-500">Quên mật khẩu?</Link>
                        </div>
                        <ButtonCustom type="submit" className="my-6 w-full" radius="lg">Đăng nhập</ButtonCustom>
                    </Form>
                </Formik>
            </div>
        </section>
    </section>);
}

export default Login;