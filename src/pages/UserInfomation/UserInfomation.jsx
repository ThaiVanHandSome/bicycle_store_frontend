import { Button, DatePicker, Radio, RadioGroup } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonCustom from "~/components/ButtonCustom";
import { MyTextInp } from "~/components/Form/FormItem";
import * as Yup from 'yup';
import { decodeJwtPayload } from "~/utils/jwt";
import { formatDay } from "~/utils/formatDay";
import { useTryCatch } from "~/hooks/useTryCatch";
import { updateUser } from "~/services/apiServices/UserService";
import { useOverlay } from "~/context/OverlayContext";
import { format, parseISO } from "date-fns";
import { useToast } from "~/context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "~/store/user/userSlice";
import HaveSpinner from "~/components/HaveSpinner";
import { parseDate } from "@internationalized/date";

function UserInfomation() {
    const dispatch = useDispatch();

    const userInfo = useSelector((state) => state.user.info);
    const user = useRef(null);

    console.log(user.current);

    const imgRef = useRef(null);
    const inpRef = useRef(null);

    const {handleTryCatch} = useTryCatch();
    const [openOverlay, hideOverlay] = useOverlay();
    const openNotification = useToast();

    const [isLoadedData, setIsLoadedData] = useState(false);
    const [selectedGender, setSelectedGender] = useState(parseInt(userInfo?.gender));
    const [birthDaySelected, setBirthDaySelected] = useState(userInfo?.birthDay);
    const [avatarUpload, setAvatarUpload] = useState("");
    
    const handleChange = (val) => {
        setSelectedGender(val);
    };

    const handleChangeDay = (val) => {
        const dayPicked = formatDay(val.year, val.month, val.day);
        const dateObject = parseISO(dayPicked); 
        const formattedDate = format(dateObject, "yyyy-MM-dd");
        setBirthDaySelected(formattedDate);
    }   

    const convertToValid = (inputDate) => {
        if(!inputDate) return;
        const parts = inputDate.split('-');
        const newDate = `${parts[0]}-${parts[2]}-${parts[1]}`;
        console.log(newDate);
        return newDate;
    }

    const handleChooseAvatar = () => {
        if (inpRef.current) {
            inpRef.current.click();
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setAvatarUpload(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataUrl = reader.result;
                if (imgRef.current) {
                    imgRef.current.src = imageDataUrl;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const getDataOfField = (val) => {
        if(!val) return "";
        return val;
    }

    useEffect(() => {
        if(userInfo) {
            user.current = userInfo;
            setIsLoadedData(true);
            setSelectedGender(parseInt(userInfo?.gender));
            setBirthDaySelected(userInfo?.birthDay);
        }
    }, [userInfo])

    return (
        <HaveSpinner showSpinner={isLoadedData}>
            <section className="flex py-6">
                <section className="w-1/2">
                    <Formik
                        initialValues={{firstName: getDataOfField(user.current?.firstName), lastName: getDataOfField(user.current?.lastName), email: getDataOfField(user.current?.email), phoneNumber: getDataOfField(user.current?.phoneNumber)}}
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
                        })}
                        onSubmit={async (values) => {
                        await handleTryCatch(async () => {
                            const formData = new FormData();
                            formData.append('avatarUpload', avatarUpload);
                            formData.append('firstName', values.firstName);
                            formData.append('lastName', values.lastName);
                            formData.append('phoneNumber', values.phoneNumber);
                            formData.append('gender', selectedGender);
                            formData.append('birthDay', getDataOfField(birthDaySelected)); 
                            openOverlay();
                            const res = await updateUser(formData);
                            hideOverlay();
                            if(res.status === "success") {
                                user.current = res.data;
                                dispatch(updateUserInfo(res.data));
                                openNotification("success", "Thông báo", res.message);
                                return;
                            }
                            openNotification("error", "Thông báo", res.message);
                        })
                        }}
                    >
                        <Form>
                            <div className="flex">
                                <MyTextInp className="w-1/2 me-4" label="Họ" name="firstName" />
                                <MyTextInp className="flex-1" label="Tên" name="lastName" />
                            </div>
                            <MyTextInp isDisabled label="Email" name="email" />
                            <MyTextInp label="Số điện thoại" name="phoneNumber" />
                            <DatePicker hideTimeZone defaultValue={birthDaySelected && parseDate(birthDaySelected)} variant="bordered" label="Sinh nhật" className="w-full" onChange={handleChangeDay}/>
                            <RadioGroup className="my-4" label="Giới tính" orientation="horizontal" defaultValue={selectedGender} value={selectedGender} onValueChange={handleChange}>
                                <Radio value={1} name="gender">Nam</Radio>
                                <Radio value={0} name="gender">Nữ</Radio>
                            </RadioGroup>
                            <ButtonCustom type="submit" radius="lg">Cập nhật</ButtonCustom>
                        </Form>
                    </Formik>
                </section>
                <section className="flex-1 flex items-center justify-center flex-col">
                    <input ref={inpRef} type="file" onChange={(e) => handleFileChange(e)} className="hidden"/>
                    <img ref={imgRef} className="w-[300px] h-[300px] rounded-full" alt="avatar" src={userInfo?.avatar}/>
                    <Button color="secondary" className="mt-4" onClick={handleChooseAvatar}>Chọn ảnh đại diện</Button>
                </section>
        </section>
        </HaveSpinner>
    );
}

export default UserInfomation;