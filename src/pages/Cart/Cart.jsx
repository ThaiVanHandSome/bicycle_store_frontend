import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ButtonCustom from "~/components/ButtonCustom";
import HaveSpinner from "~/components/HaveSpinner";
import { CartIcon, DeleteIcon, EyeIcon, VerticalDotsIcon } from "~/components/Icon/Icon";
import { useToast } from "~/context/ToastContext";
import { deleteProducInCart, getCart } from "~/services/apiServices/CartService";
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

    const {isOpen, onOpen, onClose} = useDisclosure();

    const [cart, setCart] = useState([]);
    const [countChoosens, setCountChoosens] = useState([]);
    const [finalPrices, setFinalPrices] = useState([]);
    const [totalPrices, setTotalPrices] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [indexSelected, setIndexSelected] = useState(null);

    const [loadedData, setLoadedData] = useState(false);

    const [selectedKeys, setSelectedKeys] = useState(new Set([]));

    const handleGetInitData = async () => {
        const res = await getCart();
        setLoadedData(true);
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

    const handleDecrease = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setCountChoosens(prev => {
            const newArr = [...prev];
            let val = newArr[index];
            newArr[index] = Math.max(1, val - 1);
            finalPrices[index] = newArr[index] * cart[index].bicycle.price;
            return newArr;
        })
    }

    const handleIncrease = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setCountChoosens(prev => {
            const newArr = [...prev];
            let val = newArr[index];
            newArr[index] = Math.min(cart[index].quantity, val + 1);
            finalPrices[index] = newArr[index] * cart[index].bicycle.price;
            return newArr;
        })
    }

    const handleOpenModel = (index) => {
        setIndexSelected(index);
        onOpen();
    }

    const deleteFromIndex = (arr, index) => {
        let newArr = [...arr];
        newArr = newArr.slice(0, index).concat(newArr.slice(index + 1));
        return newArr;
    }

    const handleDelete = async () => {
        const data = {
            idBicycle: cart[indexSelected].bicycle.idBicycle,
            idBicycleSize: cart[indexSelected].bicycleSize.idBicycleSize,
            idBicycleColor: cart[indexSelected].bicycleColor.idBicycleColor
        }
        const res = await deleteProducInCart(data);
        if(res.status === "success") {
            openNotification("success", "Thông báo", res.message);
        } else {
            openNotification("error", "Thông báo", res.message);
        }
        setCart(prev => {
            return deleteFromIndex(prev, indexSelected);
        })
        setCountChoosens(prev => {
            return deleteFromIndex(prev, indexSelected);
        })
        setFinalPrices(prev => {
            return deleteFromIndex(prev, indexSelected);
        })
        setSelectedKeys(prev => {
            let newKeys = new Set(prev);
            if(prev === "all") {
                newKeys = Array.from({ length: cart.length }, (v, i) => `${i}`);
                newKeys = new Set(newKeys);
            }
            newKeys.delete(`${indexSelected}`);
            newKeys = new Set([...newKeys].map(value => {
                if(parseInt(value) > indexSelected) return `${parseInt(value) - 1}`;
                return value;
            }));
            return newKeys;
          })
        onClose();
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        handleGetInitData();
    }, []);

    useEffect(() => {
        let selectedProducts = selectedKeys;
        if(selectedProducts === "all") {
            selectedProducts = Array.from({ length: cart.length }, (v, i) => i);
        }
        let totalPrices = 0;
        let totalProducts = 0;
        Array.from(selectedProducts).forEach((key) => {
            totalPrices += finalPrices[key];
            totalProducts += countChoosens[key];
        })
        setTotalPrices(totalPrices);
        setTotalProducts(totalProducts);
    }, [countChoosens, selectedKeys, finalPrices]);

    return (
        <section className="mt-[100px] px-24 py-6"> 
            <HaveSpinner showSpinner={loadedData}>
                <>
                    <h1 className="flex items-center font-bold text-xl mb-4">
                        <CartIcon width={34} height={34}/>
                        <span>Giỏ hàng</span>
                    </h1>
                    <div className="flex">
                        <Table
                            align="center"
                            aria-label="Cart"
                            selectionMode="multiple"
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                            disabledBehavior="selection"
                            className="flex-1"
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
                                                <div className="flex flex-col items-center">
                                                    <div className="flex border-2 rounded-lg me-4 mb-1 bg-white z-50">
                                                        <Dropdown>
                                                            <DropdownTrigger>
                                                                <div className="relative w-[30px] flex items-center justify-center cursor-pointer" onClick={(e) => handleDecrease(e, index)}>-</div>
                                                            </DropdownTrigger>
                                                        </Dropdown>
                                                        <Dropdown>
                                                            <DropdownTrigger>
                                                            <input value={countChoosens[index]} className="w-[30px] text-center border-s-2 border-e-2 font-bold"/>
                                                            </DropdownTrigger>
                                                        </Dropdown>
                                                        <Dropdown>
                                                            <DropdownTrigger>
                                                                <div className="relative w-[30px] flex items-center justify-center cursor-pointer" onClick={(e) => handleIncrease(e, index)}>+</div>
                                                            </DropdownTrigger>
                                                        </Dropdown> 
                                                    </div>
                                                    <span className="text-sm text-slate-400">Tồn kho: {item.quantity}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-bold text-red-600">{formatToVND(finalPrices[index])}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="relative">
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Button isIconOnly size="sm" variant="light">
                                                                <VerticalDotsIcon className="text-default-300" />
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu>
                                                            <DropdownItem>
                                                                    <Link to={`/bicycle/${item.bicycle.idBicycle}`} className="flex items-center">
                                                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50 me-1">
                                                                            <EyeIcon />
                                                                        </span>
                                                                        <span className="me-2">Xem chi tiết</span>
                                                                    </Link>         
                                                            </DropdownItem>
                                                            <DropdownItem onClick={() => handleOpenModel(index)}>
                                                                <div className="flex items-center">
                                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                        <DeleteIcon />
                                                                    </span>
                                                                    <span className="me-2 text-danger">Xóa sản phẩm</span>
                                                                </div>
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                                <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
                                                    <ModalContent>
                                                    {(onClose) => (
                                                        <>
                                                        <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                                                        <ModalBody>
                                                            <p>Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng của mình chứ?</p>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button color="danger" variant="light" onPress={onClose}>
                                                                Hủy bỏ
                                                            </Button>
                                                            <Button color="primary" variant="light" onPress={handleDelete}>
                                                                Xác nhận
                                                            </Button>
                                                        </ModalFooter>
                                                        </>
                                                    )}
                                                    </ModalContent>
                                                </Modal>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <div className="w-[20%] ms-4">
                            <div className="px-4 py-4 bg-white rounded-lg shadow-lg mb-4">
                                <p className="font-bold text-red-600"><span className="text-sm text-black">Tổng số lượng: </span> {totalProducts}</p>
                                <p className="font-bold text-red-600"><span className="text-sm text-black">Tổng giá tiền: </span> {formatToVND(totalPrices)}</p>
                            </div>
                            <ButtonCustom radius="lg" className="w-full">Thanh toán</ButtonCustom>
                        </div>
                    </div>
                </>
            </HaveSpinner>
        </section>
    );
}

export default Cart;