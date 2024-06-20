import { Input } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import ButtonCustom from "~/components/ButtonCustom";
import { MyPasswordInp, MyTextInp } from "~/components/Form/FormItem";
import routes from "~/config/routes";
import { useOverlay } from "~/context/OverlayContext";
import { useToast } from "~/context/ToastContext";
import { confirmToken, sendOtp } from "~/services/apiServices/AuthService";
import { changePassword } from "~/services/apiServices/UserService";
import { useTryCatch } from "~/hooks/useTryCatch";

function ForgotPassword() {

    const openNotification = useToast();
    const [openOverlay, hideOverlay] = useOverlay();

    // 1: enter email, 2: verify, 3: enter password: 4: success
    const [status, setStatus] = useState(1);

    const {handleTryCatch} = useTryCatch();

    const [token, setToken] = useState("");
    const [startCountdown, setStartCountdown] = useState(false);
    const [countdown, setCountdown] = useState(15 * 60 * 1000);
    const [email, setEmail] = useState("");


    const formatTime = (seconds) => {
        seconds = Math.floor(seconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
    
        // Add leading zero to seconds if needed
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    
        return `${minutes}:${formattedSeconds}`;
    }

    //handle verify
    const handleVerify = async () => {
        await handleTryCatch(async () => {
            openOverlay();
            const res = await confirmToken(token);
            hideOverlay();
            if(res.status === "success") {
                setStatus(prev => prev + 1);
                openNotification("success", "Thông báo", res.message);
                return;
            }
            openNotification("error", "Thông báo", res.message);
        });
    }

    useEffect(() => {
        if(!startCountdown) return;
        const intervalId = setInterval(() => {
            setCountdown(prev => prev - 1000);
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    }, [startCountdown])

    useEffect(() => {
        if(status === 2) {
            setStartCountdown(true);
        } 
        if(status === 3) {
            setStartCountdown(false);
        }
    }, [status]);

    return (<section className="relative mt-[100px] px-24 py-6">
        <section className="rounded-xl px-6 py-2 shadow-lg flex">
            <div className="w-1/2">
                <img alt="bicycle-bg" src={require("~/assets/images/sliders/slider-02.png")} className="w-full"/>
            </div>
            <div className="ms-10 flex-1">
                <h1 className="text-5xl font-bold text-pri text-center mb-4">Quên mật khẩu</h1>
                {
                    status === 1 && (
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={Yup.object({
                                email: Yup.string()
                                    .required("Bạn phải nhập trường này!")
                                    .email("Email không hợp lệ!")
                            })}
                            onSubmit={ async (values) => {
                                openOverlay();
                                const res = await sendOtp(values.email);
                                hideOverlay();
                                if(res.status === "success") {
                                    setStatus(prev => prev + 1);
                                    setEmail(values.email);
                                    openNotification("success", "Thông báo", res.message);
                                    return;
                                }
                                openNotification("error", "Thông báo", res.message);
                            }}
                        >
                            <Form>
                                <MyTextInp label="Email" placeholder="Nhập email của bạn" name="email"/>
                                <ButtonCustom type="submit" className="my-6 w-full" radius="lg">Gửi mã xác nhận</ButtonCustom>
                            </Form>
                        </Formik>
                    )
                }
                {
                    status === 2 && (
                        <div className="flex flex-col items-center">
                            <h2 className="text-center font-medium mb-2">Vui lòng nhập mã OTP đã được gửi về email <b>{email}</b></h2>
                            <p className="mb-4 font-bold text-danger">{formatTime(countdown)}</p>
                            <Input value={token} className="w-[200px] flex-shrink-1 mb-4" onChange={(e) => setToken(e.target.value)}/>
                            <ButtonCustom radius="lg" onClick={handleVerify}>Verify</ButtonCustom>
                        </div>
                    )
                }
                {
                    status === 3 && (
                        <Formik
                            initialValues={{ password: '', passwordAgain: '' }}
                            validationSchema={Yup.object({
                                password: Yup.string()
                                    .required("Bạn phải nhập trường này!")
                                    .matches(
                                        /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^A-Za-z0-9]).{6,})\S$/,
                                        "Bạn phải nhập mật khẩu hợp lệ! Mật khẩu phải dài ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
                                    ),
                                passwordAgain:Yup.string()
                                    .required("Bạn phải nhập trường này!")
                                    .oneOf([Yup.ref('password'), null], "Mật khẩu không khớp!")
                            })}
                            onSubmit={ async (values) => {
                                const data = {
                                    email: email,
                                    password: values.password,
                                    token: token
                                };
                                openOverlay();
                                const res = await changePassword(data);
                                hideOverlay();
                                if(res.status === "success") {
                                    setStatus(prev => prev + 1);
                                    openNotification("success", "Thông báo", res.message);
                                    return;
                                }
                                openNotification("error", "Thông báo", res.message);
                            }}
                        >
                            <Form>
                                <MyPasswordInp label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" name="password"/>
                                <MyPasswordInp label="Nhập lại mật khẩu" placeholder="Nhập lại mật khẩu của bạn" name="passwordAgain"/>
                                <ButtonCustom type="submit" className="my-6 w-full" radius="lg">Thay đổi mật khẩu</ButtonCustom>
                            </Form>
                        </Formik>
                    )
                }
                {
                    status === 4 && (
                        <div className="flex flex-col items-center">
                            <h2 className="font-bold text-lg text-secondary mb-4">Đổi mật khẩu thành công!</h2>
                            <Link to={routes.login} className="bg-pri text-white font-bold px-2 py-1 rounded-lg">Quay lại đăng nhập</Link>
                        </div>
                    )
                }
            </div>
        </section>
    </section>);
}

export default ForgotPassword;