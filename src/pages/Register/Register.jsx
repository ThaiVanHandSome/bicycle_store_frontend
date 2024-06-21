import { Input, Radio, RadioGroup } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import ButtonCustom from "~/components/ButtonCustom";
import { MyPasswordInp, MyTextInp } from "~/components/Form/FormItem";
import Status from "./Status";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import clsx from "clsx";
import { Link } from "react-router-dom";
import routes from "~/config/routes";
import { register, confirmToken } from "~/services/apiServices/AuthService";
import { useToast } from "~/context/ToastContext";
import { useOverlay } from "~/context/OverlayContext";

function Register() {

    const openNotification = useToast();
    const [openOverlay, hideOverlay] = useOverlay();

    const [selectedGender, setSelectedGender] = useState(1);
    const [startCountdown, setStartCountdown] = useState(false);
    const [countdown, setCountdown] = useState(15 * 60 * 1000);


    const [status, setStatus] = useState(1);

    const [token, setToken] = useState("");


    const handleChange = (value) => {
        setSelectedGender(value);
    };

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
        openOverlay();
        const res = await confirmToken(token);
        hideOverlay();
        if(res.status === "success") {
            setStatus(prev => {
                if(prev === 1) setStartCountdown(true);
                return prev + 1;
            });
            return;
        }
        openNotification("error", "Thông báo", res.message);
    }

    useEffect(() => {
        if(!startCountdown) return;
        const intervalId = setInterval(() => {
            setCountdown(prev => prev - 1000);
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    });

    return (<section className="relative px-2 lg:px-24 py-6 flex flex-col items-center">
        <section className="flex-col lg:flex-row flex items-start lg:items-center my-6">
            <Status status={status > 1 ? "success" : "progress"} icon={<FontAwesomeIcon icon={faUser}/>} title="Bước 1" desc="Tạo tài khoản"/>
            <div className={clsx("lg:w-[150px] lg:h-[2px] w-[2px] h-[40px] bg-slate-400 mx-2", {
                "bg-success-600": status >= 2,
            })}></div>
            <Status status={status > 2 ? "success" : status === 2 ? "progress": ""} icon={<FontAwesomeIcon icon={faEnvelope}/>} title="Bước 2" desc="Xác nhận tài khoản"/>
            <div className={clsx("lg:w-[150px] lg:h-[2px] w-[2px] h-[40px] bg-slate-400 mx-2", {
                "bg-success-600": status >= 2,
            })}></div>
            <Status status={status > 3 ? "success" : status === 3 ? "progress": ""} icon={<FontAwesomeIcon icon={faCheckCircle}/>} title="Bước 3" desc="Đăng ký thành công"/>
        </section>
        <section className="rounded-xl py-2 shadow-lg flex-shrink-1 w-3/4 lg:px-20 px-4">
            <div>
                <h1 className="text-5xl font-bold text-pri text-center mb-4">ĐĂNG KÝ</h1>
                {
                    status === 1 && (
                        <Formik
                            initialValues={{ firstName: '', lastName: '', email: '', phoneNumber: '', password: '', passwordAgain: '' }}
                            validationSchema={Yup.object({
                                firstName: Yup.string()
                                    .required("Bạn phải nhập trường này!"),
                                lastName: Yup.string()
                                    .required("Bạn phải nhập trường này!"),
                                email: Yup.string()
                                    .required("Bạn phải nhập trường này!")
                                    .email("Email không hợp lệ!"),
                                phoneNumber: Yup.string()
                                    .required("Bạn phải nhập trường này!")
                                    .matches(
                                        /^0\d{9}$/,
                                        "Bạn phải nhập số điện thoại hợp lệ!"
                                    ),
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
                                    avatar: "",
                                    email: values.email,
                                    firstName: values.firstName,
                                    lastName: values.lastName,
                                    gender: selectedGender,
                                    password: values.password,
                                    phoneNumber: values.phoneNumber
                                }
                                openOverlay();
                                const res = await register(data);   
                                hideOverlay();                    
                                if(res.status === "success") {
                                    setStatus(prev => {
                                        if(prev === 1) setStartCountdown(true);
                                        return prev + 1;
                                    });
                                    return;
                                }
                                openNotification("error", "Thông báo", res.message);
                            }}
                        >
                            <Form>
                                <MyTextInp label="Họ" placeholder="Nhập họ của bạn" name="firstName"/>
                                <MyTextInp label="Tên" placeholder="Nhập tên của bạn" name="lastName"/>
                                <MyTextInp label="Email" placeholder="Nhập email của bạn" name="email"/>
                                <MyTextInp label="Số điện thoại" placeholder="Nhập số điện thoại của bạn" name="phoneNumber"/>
                                <MyPasswordInp label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" name="password"/>
                                <MyPasswordInp label="Nhập lại mật khẩu" placeholder="Nhập lại mật khẩu của bạn" name="passwordAgain"/>
                                <RadioGroup label="Giới tính" orientation="horizontal" value={selectedGender} onValueChange={handleChange}>
                                    <Radio value={1} name="gender">Nam</Radio>
                                    <Radio value={0} name="gender">Nữ</Radio>
                                </RadioGroup>
                                <p className="mt-2 text-sm">Đã có tài khoản? <Link to={routes.login} className="font-bold text-sky-500">Đăng nhập</Link></p>
                                <ButtonCustom type="submit" className="my-6 w-full" radius="lg">Đăng ký</ButtonCustom>
                            </Form>
                        </Formik>
                    )
                }
                {
                    status === 2 && (
                        <div className="flex flex-col items-center">
                            <h2 className="text-center font-medium mb-2">Vui lòng nhập mã OTP đã được gửi về Email</h2>
                            <p className="mb-4 font-bold text-danger">{formatTime(countdown)}</p>
                            <Input value={token} className="w-[200px] flex-shrink-1 mb-4" onChange={(e) => setToken(e.target.value)}/>
                            <ButtonCustom radius="lg" onClick={handleVerify}>Verify</ButtonCustom>
                        </div>
                    )
                }
                {
                    status === 3 && (
                        <div className="flex flex-col items-center">
                            <h2 className="font-bold text-lg text-secondary mb-4 text-center">Chúc mừng bạn đã đăng ký tài khoản thành công!</h2>
                            <Link to={routes.login} className="bg-pri text-white font-bold px-2 py-1 rounded-lg">Quay lại đăng nhập</Link>
                        </div>
                    )
                }
            </div>
        </section>
    </section>);
}

export default Register;