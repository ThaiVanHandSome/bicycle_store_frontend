import { Button, Divider, Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HaveSpinner from "~/components/HaveSpinner";
import { getAllOrders } from "~/services/apiServices/OrderService";
import { formatDay } from "~/utils/formatDay";
import formatToVND from "~/utils/formatToVND";
import { getOrderState } from "~/utils/getOrderState";

function Purchase() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let page = parseInt(searchParams.get("page"));
    let size = parseInt(searchParams.get("size"));

    const [pageRes, setPageRes] = useState({});
    const [orders, setOrders] = useState([]);
    const [isLoadedData, setIsLoadedData] = useState(false);

    const handleGetInitData = async () => {
        const res = await getAllOrders(page, size);
        if(res.status === "success") {
            setOrders(res.data.content);
            setPageRes(res.data);
            setIsLoadedData(true);
        }
    }

    const handleChangePage = (page) => {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page - 1);
        queryParams.append('size', 1);
        window.location.href = `https://bicycle-store-frontend.vercel.app/#/purchase?${queryParams.toString()}`
    }

    useEffect(() => {
        console.log(page, size);
        handleGetInitData();
    }, [page, size]);


    return (
        <HaveSpinner hideSpinner={isLoadedData}>
            <section className="py-6 px-4">
                <h1 className="font-bold text-xl mb-4">Đơn hàng của tôi</h1>
                {
                    orders.map((order) => (
                        <section key={order.idOrder} className="px-3 py-4 rounded-xl shadow-lg bg-slate-100 mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-2">
                                <div className="text-sm mb-2 lg:mb-0">   
                                    <span className="font-bold me-2 text-pri">Mã đơn hàng: {order.idOrder}</span>
                                    <span className="text-slate-400">Ngày tạo: {formatDay(order.orderedAt[0], order.orderedAt[1], order.orderedAt[2])}</span>
                                </div>
                                <div className="w-1/3 lg:w-auto text-sm px-2 py-1 bg-slate-400 rounded-lg text-white">
                                    <span>{getOrderState(order.orderState)}</span>
                                </div>
                            </div>
                            <Divider className="w-full my-2"/>
                            <div>
                                {
                                    order.bicycleProductModels.map(item => (
                                        <div key={item.bicycleName} className="flex items-center justify-between">
                                            <div className="flex items-center mb-2">
                                                <img className="w-[100px] me-2" alt="bicycle-img" src={item.bicycleImage}/>
                                                <div>
                                                    <h2 className="font-bold text-pri text-md">{item.bicycleName}</h2>
                                                    <p className="text-sm text-slate-400">Màu sắc: {item.bicycleColorName}</p>
                                                    <p className="text-sm text-slate-400">Kích thước: {item.bicycleSizeName}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold">
                                                <p><span className="text-red-600">{formatToVND(item.bicyclePrice)}</span> <span className="text-secondary-600">x{item.totalQuantity}</span></p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <Divider className="w-full my-2"/>
                            <div className="flex items-center justify-between">
                                <Link to={`/purchase-detail/${order.idOrder}`}>
                                    <Button variant="bordered" color="secondary">Xem chi tiết</Button>
                                </Link>
                                <p className="font-bold">Tổng tiền: <span className="text-red-600">{formatToVND(order.totalPrice)}</span></p>
                            </div>
                        </section>
                    ))
                }
                <div className="w-full flex items-center justify-center lg:justify-start">
                    <Pagination isCompact showControls total={pageRes.totalPages} initialPage={page + 1} onChange={handleChangePage}/>
                </div>
            </section>
        </HaveSpinner>
    );
}

export default Purchase;