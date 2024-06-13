import { Input, Radio, RadioGroup, Spinner } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from 'yup';
import ButtonCustom from "~/components/ButtonCustom";
import { MyPasswordInp, MyTextInp } from "~/components/Form/FormItem";
import Status from "./Status";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import clsx from "clsx";
import { Link } from "react-router-dom";
import routes from "~/config/routes";
import { register, registerConfirm } from "~/services/apiServices/AuthService";
import { useToast } from "~/context/ToastContext";

function Register() {

    const openNotification = useToast();

    const [selectedGender, setSelectedGender] = useState(1);
    const [startCountdown, setStartCountdown] = useState(false);
    const [countdown, setCountdown] = useState(15 * 60 * 1000);


    const [status, setStatus] = useState(1);

    const [token, setToken] = useState("");

    const spinnerRef = useRef();
    const overlayRef = useRef();

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

    // handle overlay and spinner
    const loading = () => {
        spinnerRef.current.style.display = "block";
        overlayRef.current.style.display = "block";
    }

    const notLoading = () => {
        spinnerRef.current.style.display = "none";
        overlayRef.current.style.display = "none";
    }

    //handle verify
    const handleVerify = async () => {
        loading();
        const res = await registerConfirm(token);
        notLoading();
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
    })

    return (<section className="relative mt-[100px] px-24 py-6 flex flex-col items-center">
        <div ref={overlayRef} style={{backgroundColor: "rgba(0, 0, 0, 0.15)"}} className="hidden absolute top-0 left-0 right-0 bottom-0 z-20"></div>
        <Spinner ref={spinnerRef} color="warning" className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"/>
        <section className="flex items-center my-6">
            <Status status={status > 1 ? "success" : "progress"} icon={<FontAwesomeIcon icon={faUser}/>} title="Bước 1" desc="Tạo tài khoản"/>
            <div className={clsx("w-[150px] h-[2px] bg-slate-400 mx-2", {
                "bg-success-600": status >= 2,
            })}></div>
            <Status status={status > 2 ? "success" : status === 2 ? "progress": ""} icon={<FontAwesomeIcon icon={faEnvelope}/>} title="Bước 2" desc="Xác nhận tài khoản"/>
            <div className={clsx("w-[150px] h-[2px] bg-slate-400 mx-2", {
                "bg-success-600": status >= 3,
            })}></div>
            <Status status={status > 3 ? "success" : status === 3 ? "progress": ""} icon={<FontAwesomeIcon icon={faCheckCircle}/>} title="Bước 3" desc="Đăng ký thành công"/>
        </section>
        <section className="rounded-xl py-2 shadow-lg flex-shrink-1 w-3/4 px-20">
            <div>
                <h1 className="text-5xl font-bold text-pri text-center mb-4">Sign Up</h1>
                {
                    status === 1 && (
                        <Formik
                            initialValues={{ firstName: '', lastName: '', email: '', password: '', passwordAgain: '' }}
                            validationSchema={Yup.object({
                                firstName: Yup.string()
                                    .required("You must enter this field!"),
                                lastName: Yup.string()
                                    .required("You must enter this field!"),
                                email: Yup.string()
                                    .required("You must enter this field!")
                                    .email("Invalid email address!"),
                                password: Yup.string()
                                    .required("You must enter this field!")
                                    .matches(
                                        /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^A-Za-z0-9]).{6,})\S$/,
                                        "You must enter a valid password! Password must be at least 6 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
                                    ),
                                passwordAgain:Yup.string()
                                    .required("You must enter this field!")
                                    .oneOf([Yup.ref('password'), null], "Passwords must match!")
                            })}
                            onSubmit={ async (values) => {
                                const data = {
                                    avatar: "",
                                    email: values.email,
                                    firstName: values.firstName,
                                    lastName: values.lastName,
                                    gender: selectedGender,
                                    password: values.password
                                }
                                loading();
                                const res = await register(data);   
                                notLoading();                    
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
                                <MyTextInp label="First Name" placeholder="Enter your first name" name="firstName"/>
                                <MyTextInp label="Last Name" placeholder="Enter your last name" name="lastName"/>
                                <MyTextInp label="Email" placeholder="Enter your email" name="email"/>
                                <MyPasswordInp label="Password" placeholder="Enter your password" name="password"/>
                                <MyPasswordInp label="Password Again" placeholder="Enter your password again" name="passwordAgain"/>
                                <RadioGroup label="Gender" orientation="horizontal" value={selectedGender} onValueChange={handleChange}>
                                    <Radio value={1} name="gender">Nam</Radio>
                                    <Radio value={0} name="gender">Nữ</Radio>
                                </RadioGroup>
                                <p className="mt-2 text-sm">Đã có tài khoản? <Link to={routes.login} className="font-bold text-sky-500">Đăng nhập</Link></p>
                                <ButtonCustom type="submit" className="my-6 w-full" radius="lg">Sign up</ButtonCustom>
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
                            <h2 className="font-bold text-lg text-secondary mb-4">Chúc mừng bạn đã đăng ký tài khoản thành công!</h2>
                            <Link to={routes.login} className="bg-pri text-white font-bold px-2 py-1 rounded-lg">Quay lại đăng nhập</Link>
                        </div>
                    )
                }
            </div>
        </section>
    </section>);
}

export default Register;