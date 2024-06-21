import { faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Radio, RadioGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as Yup from 'yup';
import ButtonCustom from "~/components/ButtonCustom";
import { MyTextInp } from "~/components/Form/FormItem";
import HaveSpinner from "~/components/HaveSpinner";
import { useOverlay } from "~/context/OverlayContext";
import { useToast } from "~/context/ToastContext";
import { useTryCatch } from "~/hooks/useTryCatch";
import { checkout } from "~/services/apiServices/OrderService";
import { getAllPayMethods } from "~/services/apiServices/PayMethodService";
import formatToVND from "~/utils/formatToVND";
import { decodeJwtPayload } from "~/utils/jwt";

const columns = [
    {
      key: "image",
      label: "Hình ảnh",
    },
    {
      key: "info",
      label: "Thông tin",
    },
    {
      key: "price",
      label: "Đơn giá",
    },
    {
        key: "count",
        label: "Số lượng",
    },
    {
        key: "finalPrice",
        label: "Thành tiền",
    }
  ];


function Payment() {
    const openNotification = useToast();
    const [openOverlay, hideOverlay] = useOverlay();

    const {handleTryCatch} = useTryCatch();

    const [isLoadedData, setIsLoadedData] = useState(false);
    const [products, setProducts] = useState([]);
    const [userInfo, setUserInfo] = useState(() => {
        const accessToken = localStorage.getItem("accessToken");
        if(accessToken) {
            const payload = decodeJwtPayload(accessToken);
            return payload;
        }
    });
    const [payMethods, setPayMethods] = useState([]);
    const [payMethodChecked, setPayMethodChecked] = useState(null);

    const handleGetInitData = async () => {
        await handleTryCatch(async () => {
            setProducts(JSON.parse(localStorage.getItem("productsSelected")) || []);
            const accessToken = localStorage.getItem("accessToken");
            const res = await getAllPayMethods();
            if(res.status === "success") {
                setPayMethods(res.data);
            }
            setIsLoadedData(true);
        });
    }

    const totalPrice = useMemo(() => {
        return products.reduce((accumulator, product) => {
            return accumulator + product.totalPrices;
        }, 0);
    }, [products]);

    const totalQuantity = useMemo(() => {
        return products.reduce((accumulator, product) => {
            return accumulator + product.totalProducts;
        }, 0);
    }, [products]);
    

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
          });   
        handleGetInitData();
    }, []);
    return (
        <section className="py-6 lg:px-24 px-4">
            <HaveSpinner showSpinner={isLoadedData}>
                <>
                        <h1 className="font-bold text-2xl mb-4">
                        <FontAwesomeIcon icon={faMoneyBill1Wave}/>
                        <span className="ms-2">Thanh toán</span>
                    </h1>
                    <div>
                        <Formik
                            initialValues={{fullName: `${!!userInfo?.firstName && !!userInfo?.lastName ? userInfo?.firstName + " " + userInfo?.lastName : ""}` || '', phoneNumber: userInfo?.phoneNumber || '', address: "", message: ""}}
                            validationSchema={Yup.object({
                                fullName: Yup.string()
                                    .required("Bạn phải nhập trường này!"),
                                phoneNumber: Yup.string()
                                    .required("Bạn phải nhập trường này!")
                                    .matches(
                                        /^0\d{9}$/,
                                        "Bạn phải nhập số điện thoại hợp lệ!"
                                    ),
                                address: Yup.string()
                                    .required("Bạn phải nhập trường này!"),
                                message: Yup.string()
                                    .required("Bạn phải nhập trường này!")
                            })}
                            onSubmit={async (values) => {
                                if(!payMethodChecked) {
                                    openNotification("error", "Thông báo", "Bạn phải chọn phương thức thanh toán!");
                                    return;
                                }
                                openOverlay();
                                const bicycleProductList = products.map((product) => ({
                                    idBicycle: product.data.bicycle.idBicycle,
                                    idBicycleSize: product.data.bicycleSize.idBicycleSize,
                                    idBicycleColor: product.data.bicycleColor.idBicycleColor,
                                    quantity: product.totalProducts
                                }));
                                await handleTryCatch(async () => {
                                    const data = {
                                        bicycleProductModels: bicycleProductList,
                                        idPayMethod: payMethodChecked,
                                        totalQuantity: totalQuantity,
                                        totalPrice: totalPrice,
                                        shipPrice: 0,
                                        shipAddress: values.address,
                                        message: values.message,
                                        fullName: values.fullName,
                                        phoneNumber: values.phoneNumber
                                    }
                                    const res = await checkout(data);
                                    hideOverlay();
                                    if(res.status === "success") {
                                        openNotification("success", "Thông báo", res.message);
                                        localStorage.removeItem("productsSelected");
                                        window.location.href = "http://localhost:3000/bicycle_store_frontend#/";
                                        return;
                                    }
                                    openNotification("error", "Thông báo", res.message);
                                });
                            }}
                        >
                            <Form>
                                <div className="rounded-3xl shadow-lg px-4 py-2 mb-4">
                                    <h2 className="text-sm font-bold text-pri mb-1">Địa chỉ nhận hàng</h2>
                                    <div className="flex items-center">
                                        <MyTextInp label="Họ và tên" name="fullName" className="me-4 w-1/2"/>
                                        <MyTextInp label="Số điện thoại" name="phoneNumber" className="flex-1"/>
                                    </div>
                                    <MyTextInp label="Địa chỉ" name="address"/>
                                </div>
                                <div className="rounded-3xl shadow-lg px-4 py-2 mb-8">
                                    <h2 className="text-sm font-bold text-pri mb-1">Sản phẩm</h2>
                                    <Table>
                                        <TableHeader>
                                            {
                                                columns.map((item) => (
                                                    <TableColumn key={item.key}>{item.label}</TableColumn>
                                                ))
                                            }
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                products.map((product, index) => (
                                                    <TableRow key={product.data.bicycle.idBicycle}>
                                                        <TableCell>
                                                            <img className="w-[100px]" alt="bicycle-image" src={product.data.bicycle.image}/>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <h2 className="font-bold text-pri text-md">{product.data.bicycle.name}</h2>
                                                                <p className="text-sm text-slate-400">Màu sắc: {product.data.bicycleColor.name}</p>
                                                                <p className="text-sm text-slate-400">Kích thước: {product.data.bicycleSize.name}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-bold text-red-600">{formatToVND(product.data.bicycle.price)}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-bold">{product.totalProducts}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-bold text-red-600">{formatToVND(product.totalPrices)}</span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="rounded-3xl shadow-lg px-4 py-2 mb-8">
                                    <h2 className="text-sm font-bold text-pri mb-1">Phương thức thanh toán</h2>
                                    <RadioGroup onValueChange={val => setPayMethodChecked(val)}>
                                        {
                                            payMethods.map((payMethod) => (
                                                <Radio key={payMethod.idPayMethod} value={payMethod.idPayMethod}>{payMethod.name}</Radio>
                                            ))
                                        }
                                    </RadioGroup>
                                </div>
                                <div className="rounded-3xl shadow-lg px-4 py-2 mb-8">
                                    <h2 className="text-sm font-bold text-pri mb-1">Lời nhắn cho shop</h2>
                                    <MyTextInp label="Lời nhắn" name="message"/>
                                </div>
                                <div className="rounded-3xl shadow-lg px-4 py-2 mb-8 flex justify-end">
                                    <div className="font-bold">
                                        <p>Tổng tiền hàng: <span className="text-xl text-red-600">{formatToVND(totalPrice)}</span></p>
                                        <p>Phí vận chuyển: <span className="text-xl text-red-600">{formatToVND(0)}</span></p>
                                        <p>Tổng thanh toán: <span className="text-xl text-red-600">{formatToVND(totalPrice + 0)}</span></p>
                                        <div className="flex justify-end my-4">
                                            <ButtonCustom type="submit" radius="lg">Thanh toán</ButtonCustom>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </Formik>     
                    </div>
                </>
            </HaveSpinner>
        </section>
    );
}

export default Payment;