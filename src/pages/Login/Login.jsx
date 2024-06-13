import { Spinner } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { useRef } from "react";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import ButtonCustom from "~/components/ButtonCustom";
import { MyPasswordInp, MyTextInp } from "~/components/Form/FormItem";
import routes from "~/config/routes";
import { useToast } from "~/context/ToastContext";
import { authenticate } from "~/services/apiServices/AuthService";

function Login() {

    const openNotification = useToast();

    const spinnerRef = useRef();
    const overlayRef = useRef();

    // handle overlay and spinner
    const loading = () => {
        spinnerRef.current.style.display = "block";
        overlayRef.current.style.display = "block";
    }

    const notLoading = () => {
        spinnerRef.current.style.display = "none";
        overlayRef.current.style.display = "none";
    }

    return (<section className="relative mt-[100px] px-24 py-6">
        <div ref={overlayRef} style={{backgroundColor: "rgba(0, 0, 0, 0.15)"}} className="hidden absolute top-0 left-0 right-0 bottom-0 z-20"></div>
        <Spinner ref={spinnerRef} color="warning" className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"/>
        <section className="rounded-xl px-6 py-2 shadow-lg flex">
            <div className="w-1/2">
                <img alt="bicycle-bg" src={require("~/assets/images/sliders/slider-02.png")} className="w-full"/>
            </div>
            <div className="ms-10 flex-1">
                <h1 className="text-5xl font-bold text-pri text-center mb-4">Sign In</h1>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={Yup.object({
                        email: Yup.string()
                            .required("You must enter this field!")
                            .email("Invalid email address!"),
                        password: Yup.string()
                            .required("You must enter this field!")
                            .matches(
                                /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^A-Za-z0-9]).{6,})\S$/,
                                "You must enter a valid password! Password must be at least 6 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
                            ),
                    })}
                    onSubmit={ async (values) => {
                        const data = {
                            email: values.email,
                            password: values.password
                        }
                        loading();
                        const res = await authenticate(data);
                        notLoading();
                        if(res === null) {
                            openNotification("error", "Thông báo", "Email or Password Wrong!");
                        }
                        notLoading();
                        if(res.status === "success") {
                            localStorage.setItem("accessToken", res.data.accessToken);
                            localStorage.setItem("refreshToken", res.data.refreshToken);
                            openNotification("success", "Thông báo", res.message);
                            window.location.href = "http://localhost:3000/bicycle_store_frontend#/";
                            return;
                        }
                        openNotification("error", "Thông báo", res.message);
                    }}
                >
                    <Form>
                        <MyTextInp label="Email" placeholder="Enter your email" name="email"/>
                        <MyPasswordInp label="Password" placeholder="Enter your password" name="password"/>
                        <div className="flex items-center justify-between">
                            <p className="mt-2 text-sm">Bạn chưa có tài khoản? <Link to={routes.register} className="font-bold text-sky-500">Đăng ký</Link></p>
                            <Link className="text-sm font-bold text-sky-500">Quên mật khẩu?</Link>
                        </div>
                        <ButtonCustom type="submit" className="my-6 w-full" radius="lg">Sign in</ButtonCustom>
                    </Form>
                </Formik>
            </div>
        </section>
    </section>);
}

export default Login;