import { Table, TableHeader, TableBody, TableCell,TableRow, TableColumn } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HaveSpinner from "~/components/HaveSpinner";
import { getOrderById } from "~/services/apiServices/OrderService";
import { formatDay } from "~/utils/formatDay";
import formatToVND from "~/utils/formatToVND";
import { getOrderState } from "~/utils/getOrderState";

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

function PurchaseDetail() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [isLoadedData, setIsLoadedData] = useState(false);

    const handleGetInitData = async () => {
        const res = await getOrderById(id);
        if(res.status === "success") {
            setOrder(res.data);
            setIsLoadedData(true);
        }
    }

    useEffect(() => {
        handleGetInitData();
    }, [id]);

    return (
        <HaveSpinner hideSpinner={isLoadedData}>
            <section className="w-full py-6 px-4">
                <h1 className="font-bold text-xl mb-4">Chi tiết đơn hàng</h1>
                <div>
                    <div className="flex items-center justify-between px-3 bg-slate-100 py-2 rounded-xl shadow-lg mb-4">
                        <div className="text-sm">   
                            <span className="font-bold me-2 text-pri">Mã đơn hàng: {order?.idOrder}</span>
                            <span className="text-slate-400">Ngày tạo: {order && formatDay(order?.orderedAt[0], order?.orderedAt[1], order?.orderedAt[2])}</span>
                        </div>
                        <div className="text-sm px-2 py-1 bg-slate-400 rounded-lg text-white">
                            <span>{getOrderState(order?.orderState)}</span>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row mb-4">
                        <div className="lg:w-1/2 w-full px-3 mb-4 lg:mb-0">
                            <div className="py-2 px-4 rounded-xl shadow-lg bg-slate-100 h-full">
                                <h1 className="text-sm text-slate-400 mb-2">Thông tin người nhận</h1>
                                <div>
                                    <p className="font-bold">{order?.fullName}</p>
                                    <p>{order?.phoneNumber}</p>
                                    <p>{order?.shipAddress}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 px-3">
                            <div className="py-2 px-4 rounded-xl shadow-lg bg-slate-100 h-full">
                                <h1 className="text-sm text-slate-400 mb-2">Hình thức thanh toán</h1>
                                <p className="font-bold">{order?.payMethod}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
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
                                order?.bicycleProductModels.map((product, index) => (
                                    <TableRow key={product.bicycleName}>
                                        <TableCell>
                                            <img className="w-[100px]" alt="bicycle-image" src={product.bicycleImage}/>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <h2 className="font-bold text-pri text-md">{product.bicycleName}</h2>
                                                <p className="text-sm text-slate-400">Màu sắc: {product.bicycleColorName}</p>
                                                <p className="text-sm text-slate-400">Kích thước: {product.bicycleSizeName}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-red-600">{formatToVND(product.bicyclePrice)}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold">{product.totalQuantity}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-red-600">{formatToVND(product.totalQuantity * product.bicyclePrice)}</span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
                <div className="rounded-3xl shadow-lg px-4 py-2 mb-8 flex justify-end">
                    <div className="font-bold">
                        <p>Tổng tiền hàng: <span className="text-xl text-red-600">{formatToVND(order?.totalPrice)}</span></p>
                        <p>Phí vận chuyển: <span className="text-xl text-red-600">{formatToVND(0)}</span></p>
                        <p>Tổng thanh toán: <span className="text-xl text-red-600">{formatToVND(order?.totalPrice + 0)}</span></p>
                    </div>
                </div>
            </section>
        </HaveSpinner>
    );
}

export default PurchaseDetail;