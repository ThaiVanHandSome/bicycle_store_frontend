import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CartIcon, DeleteIcon, EyeIcon } from "~/components/Icon/Icon";
import { useToast } from "~/context/ToastContext";
import { getCart } from "~/services/apiServices/CartService";
import formatToVND from "~/utils/formatToVND";

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
    },
    {
        key: "action",
        label: "Thao tác",
    },
  ];

function Cart() {
    const openNotification = useToast();

    const [cart, setCart] = useState([]);
    const [countChoosens, setCountChoosens] = useState([]);
    const [finalPrices, setFinalPrices] = useState([]);

    const [selectedKeys, setSelectedKeys] = useState(new Set([]));

    const handleGetInitData = async () => {
        const res = await getCart();
        if(res.status === "success") {
            setCart(res.data);
            const arr = Array(res.data.length).fill(1);
            setCountChoosens(arr);
            let arr1 = [];
            Array.from(res.data).forEach((item) => {
                arr1 = [...arr1, item.bicycle.price];
            })
            setFinalPrices(arr1);
            return;
        }
        openNotification("error", "Thông báo", res.message);
    }

    const handleDecrease = (index) => {
        setCountChoosens(prev => {
            const newArr = [...prev];
            let val = newArr[index];
            newArr[index] = Math.max(1, val - 1);
            finalPrices[index] = newArr[index] * cart[index].bicycle.price;
            return newArr;
        })
    }

    const handleIncrease = (index) => {
        setCountChoosens(prev => {
            const newArr = [...prev];
            let val = newArr[index];
            newArr[index] = Math.min(cart[index].quantity, val + 1);
            finalPrices[index] = newArr[index] * cart[index].bicycle.price;
            return newArr;
        })
    }

    useEffect(() => {
        handleGetInitData();
    }, []);

    console.log(selectedKeys);

    return (
        <section className="mt-[100px] px-24 py-6"> 
            <h1 className="flex items-center font-bold text-xl mb-4">
                <CartIcon width={34} height={34}/>
                <span>Giỏ hàng</span>
            </h1>
            <div>
                <Table
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                >
                    <TableHeader columns={columns}>
                        {(column => (<TableColumn key={column.key}>{column.label}</TableColumn>))}
                    </TableHeader>
                    <TableBody>
                        {
                            cart.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <img className="w-[100px]" alt="bicycle-image" src={item.bicycle.image}/>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <h2 className="font-bold text-pri text-md">{item.bicycle.name}</h2>
                                            <p className="text-sm text-slate-400">Màu sắc: {item.bicycleColor.name}</p>
                                            <p className="text-sm text-slate-400">Kích thước: {item.bicycleSize.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold text-red-600">{formatToVND(item.bicycle.price)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-center z-50">
                                            <div className="flex border-2 rounded-lg me-4 mb-1">
                                                <div className="w-[30px] flex items-center justify-center cursor-pointer" onClick={() => handleDecrease(index)}>-</div>
                                                <input value={countChoosens[index]} className="w-[30px] text-center border-s-2 border-e-2 font-bold"/>
                                                <div className="w-[30px] flex items-center justify-center cursor-pointer" onClick={() => handleIncrease(index)}>+</div>
                                            </div>
                                            <span className="text-sm text-slate-400">Tồn kho: {item.quantity}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold text-red-600">{formatToVND(finalPrices[index])}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Tooltip content="Xem chi tiết">
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50 me-1">
                                                    <EyeIcon />
                                                </span>
                                            </Tooltip>
                                            <Tooltip color="danger" content="Xóa sản phẩm">
                                                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                    <DeleteIcon />
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}

export default Cart;