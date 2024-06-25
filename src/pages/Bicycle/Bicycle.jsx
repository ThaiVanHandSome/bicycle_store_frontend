import { faCircleArrowLeft, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Input, Pagination, Radio, RadioGroup, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, User } from "@nextui-org/react";
import { Carousel } from "antd";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ButtonCustom from "~/components/ButtonCustom";
import ProductCard from "~/components/ProductCard";
import { useToast } from "~/context/ToastContext";
import { addToCart } from "~/services/apiServices/BicycleProductService";
import { getAllColors, getAllCommentsOfBicycle, getAllSizes, getBicycleById, getBicycleRelevant } from "~/services/apiServices/BicycleService";
import { getAllCategoriesOfBicycle } from "~/services/apiServices/CategoryService";
import { checkoutProcessor } from "~/services/apiServices/OrderService";
import { fetchCart } from "~/store/actions/cartAction";
import formatToVND from "~/utils/formatToVND";
import { useTryCatch } from "~/hooks/useTryCatch";
import { isPossitiveNumber } from "~/utils/number";
import HaveSpinner from "~/components/HaveSpinner";
import { addComment } from "~/services/apiServices/BicycleCommentService";
import { useOverlay } from "~/context/OverlayContext";
import { formatDay } from "~/utils/formatDay";

function Bicycle() {
    // toast
    const openNotification = useToast();

    const [openOverlay, hideOverlay] = useOverlay();

    // redux
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.info);

    const {handleTryCatch} = useTryCatch();

    const { id } = useParams();
    const [isLoadedData, setIsLoadedData] = useState(false);
    const [bicycle, setBicycle] = useState(null);
    const [bicycleCategories, setBicycleCategories] = useState([]);
    const [bicyclesRelevant, setBicyclesRelevant] = useState([]);

    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colorChecked, setColorChecked] = useState(null);
    const [sizeChecked, setSizeChecked] = useState(null);

    const [countBicycleChoosen, setCountBicycleChoosen] = useState(1);

    const [showDesc, setShowDesc] = useState(true);

    const [carouselIndexChecked, setCarouselIndexChecked] = useState(0);

    const [comments, setComments] = useState("");
    const [commentVal, setCommentVal] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(3);

    // carousel
    const carouselRef = useRef();

    const handlePrevCarousel = () => {
        carouselRef.current.prev();
        setCarouselIndexChecked(Math.max(carouselRef.current.innerSlider.state.currentSlide - 1, 0));
    }

    const handleNextCarousel = () => {
        carouselRef.current.next();
        setCarouselIndexChecked(Math.min(carouselRef.current.innerSlider.state.currentSlide + 1, bicycle?.thumbnails.length - 1));
    }

    const handleChangeCarouselItem = (index) => {
        carouselRef.current.goTo(index, true);
        setCarouselIndexChecked(index);
    }

    const handleAfterChange = () => {
        setCarouselIndexChecked(carouselRef.current.innerSlider.state.currentSlide);
    }

    // count bicycle choosen
    const handleIncreaseCount = () => {
        setCountBicycleChoosen(prev => {
            if(!isPossitiveNumber(prev)) {
                return prev;
            }
            return prev + 1;
        });
    }

    const handleDecreaseCount = () => {
        setCountBicycleChoosen(prev => {
            if(prev === 1 || !isPossitiveNumber(prev)) return prev;
            return prev - 1;
        })
    }

    const handleChangeCount = (val) => {
        if(val.length === 0) {
            setCountBicycleChoosen("");
            return;
        }
        if(isPossitiveNumber(val)) {
            setCountBicycleChoosen(parseInt(val));
        }
    }

    const handleBlur = (val) => {
        if(val.length === 0) {
            setCountBicycleChoosen(1);
        }
    }

    // handle tab
    const handleChangeTab = (selectedId) => {
        if(selectedId === "desc") {
            setShowDesc(true);
            return;
        } 
        setShowDesc(false);
    }

    const handleAddToCart = async () => {
        if(!localStorage.getItem("accessToken")) {
            openNotification("error", "Thông báo", "Quý khách cần đăng nhập để thực hiện chức năng này!");
            return;
        }
        if(id === null || colorChecked === null || sizeChecked === null) {
            openNotification("error", "Thông báo", "Quý khách vui lòng loại sản phẩm phù hợp!");
            return;
        }
        const data = {
            idBicycle: parseInt(id),
            idBicycleColor: colorChecked,
            idBicycleSize: sizeChecked
        }
        await handleTryCatch(async () => {
            const {check, message} = await addToCart(data);
            if(!check) {
                openNotification("error", "Thông báo", message);
            } else {
                openNotification("success", "Thông báo", message);
            }
            dispatch(fetchCart());
        });
    }

    const getInitData = async () => {
        await handleTryCatch(async () => {
            const bicycleRes = await getBicycleById(id);
            if(bicycleRes.status === "success") {
                setBicycle(bicycleRes.data);

                const bicyclesRelevantRes = await getBicycleRelevant(bicycleRes.data.idBicycle);
                if(bicyclesRelevantRes.status === "success") setBicyclesRelevant(bicyclesRelevantRes.data);

                const colorsRes = await getAllColors();
                if(colorsRes.status === "success") setColors(colorsRes.data);

                const sizesRes = await getAllSizes();
                if(sizesRes.status === "success") setSizes(sizesRes.data);

                const bicycleCategoriesRes = await getAllCategoriesOfBicycle(bicycleRes.data.idBicycle);
                if(bicycleCategoriesRes.status === "success") setBicycleCategories(bicycleCategoriesRes.data);  

                const bicycleCommentsRes = await getAllCommentsOfBicycle(parseInt(id), 0, 3);
                if(bicycleCommentsRes.status === "success") setComments(bicycleCommentsRes.data || []);
                
                setIsLoadedData(true);
            }
        } )
    }

    const getValueOfBicycle = (val) => {
        if(val === null) return "N/A";
        return val;
    }

    const handlePayment = async () => {
        if(!localStorage.getItem("accessToken")) {
            openNotification("error", "Thông báo", "Quý khách cần đăng nhập để thực hiện chức năng này!");
            return;
        }
        if(id === null || colorChecked === null || sizeChecked === null) {
            openNotification("error", "Thông báo", "Quý khách vui lòng loại sản phẩm phù hợp!");
            return;
        };
        await handleTryCatch(async () => {
            const res = await checkoutProcessor(parseInt(id), colorChecked, sizeChecked, countBicycleChoosen);
                if(res.status === "success" && res.data === true) {
                    const color = colors.find(color => color.idBicycleColor === colorChecked);
                    const size = sizes.find(size => size.idBicycleSize === sizeChecked);
                    const productsSelected = [
                        {
                            data: {
                                bicycle,
                                bicycleColor: color,
                                bicycleSize: size
                            },
                            totalPrices: bicycle?.price * countBicycleChoosen,
                            totalProducts: countBicycleChoosen
                        }
                    ]
                    localStorage.setItem("productsSelected", JSON.stringify(productsSelected));
                    window.location.href = "http://localhost:3000/bicycle_store_frontend#/payment";
                    return;
                }
                openNotification("error", "Thông báo", res.message);
        });
    }

    const handleAddComment = async () => {
        if(commentVal.length === 0) {
            openNotification("error", "Thông báo", "Bạn chưa nhập nội dung comment!");
            return;
        }
        await handleTryCatch(async () => {
            const data = {
                content: commentVal,
                idBicycle: parseInt(id)
            }
            openOverlay();
            const res = await addComment(data);
            hideOverlay();
            if(res.status === "success") {
                openNotification("success", "Thông báo", res.message);
                const bicycleCommentsRes = await getAllCommentsOfBicycle(parseInt(id), 0, 3);
                if(bicycleCommentsRes.status === "success") setComments(bicycleCommentsRes.data || []);
                setCommentVal("");
                return;
            }
            openNotification("error", "Thông báo", res.message);
        });
    }

    const handleChangePage = async (page) => {
        await handleTryCatch(async () => {
            const bicycleCommentsRes = await getAllCommentsOfBicycle(parseInt(id), page - 1, size);
            if(bicycleCommentsRes.status === "success") setComments(bicycleCommentsRes.data || []);
            setPage(page - 1);
        })
    }

     // reload data mỗi khi id được truyền vào thay đổi
    useEffect(() => {
        setPage(0);
        setSize(3);
        getInitData();
    }, [id]);

    return (
        <HaveSpinner hideSpinner={isLoadedData}>
            <section className="relative min-h-[100vh]">
                <section className="py-2 px-4 lg:px-16 xl:px-28 mb-6">
                    <section className="block lg:flex">
                        <div className="w-full lg:w-[40%] me-4 group">
                            <div className="w-full relative">
                                <FontAwesomeIcon icon={faCircleArrowLeft} className="cursor-pointer absolute top-1/2 left-0 opacity-0 z-10 -translate-y-1/2 text-2xl group-hover:left-2 group-hover:opacity-100 transition-all" onClick={handlePrevCarousel}/>
                                <FontAwesomeIcon icon={faCircleArrowRight} className="cursor-pointer absolute top-1/2 right-0 opacity-0 z-10 -translate-y-1/2 text-2xl group-hover:right-2 group-hover:opacity-100 transition-all" onClick={handleNextCarousel}/>
                                <Carousel ref={carouselRef} arrows infinite={false} afterChange={handleAfterChange}>
                                    {
                                        bicycle?.thumbnails.map((src, index) => {
                                            return (
                                                <img key={index} src={src} alt="thumbnail"/>
                                            )
                                        })
                                    }
                                </Carousel>
                            </div>
                            <div className="w-full mt-4 flex overflow-y-auto no-scrollbar lg:has-scrollbar">
                                {
                                    bicycle?.thumbnails.map((src, index) => {
                                        return (
                                            <div key={index} className={clsx("block flex-shrink-0 w-[100px] me-4 cursor-pointer hover:border-1 hover:border-slate-800 hover:rounded-md", {
                                                "border-1 rounded-md": carouselIndexChecked === index
                                            })} onClick={() => handleChangeCarouselItem(index)}>
                                                <img className="rounded-md w-[100px] block" src={src} alt="thumbnail"/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="flex-1 lg:ps-20 pt-6">
                            <h1 className="text-4xl font-bold mb-2">{bicycle?.name}</h1>
                            <h2 className="text-2xl text-danger font-bold mb-2">{formatToVND(bicycle?.price)}</h2>
                            <p className="mb-2">Mã sản phẩm: <b>{bicycle?.idBicycle}</b></p>
                            <div className="mb-3">
                                Danh mục sản phẩm: {
                                    bicycleCategories.map((category, index) => (
                                        <Link key={category.idCategory} to={`/category/${category.idCategory}`} className="hover:text-pri hover:font-bold transition-all me-2">{category.name}</Link>
                                    ))
                                }
                            </div>
                            <div className="mb-3">
                                <RadioGroup label="Kích thước" orientation="horizontal" onValueChange={(val) => setSizeChecked(val)}>
                                    {
                                        sizes.map((size, index) => (
                                            <Radio key={size.idBicycleSize} value={size.idBicycleSize}>{size.name}</Radio>
                                        ))
                                    }
                                </RadioGroup>
                            </div>
                            <div className="mb-3">
                                <RadioGroup label="Màu sắc" orientation="horizontal" onValueChange={(val) => setColorChecked(val)}>
                                        {
                                            colors.map((color, index) => (
                                                <Radio key={color.idBicycleColor} value={color.idBicycleColor}>{color.name}</Radio>
                                            ))
                                        }
                                </RadioGroup>
                            </div>
                            <div className="flex mb-8">
                                <div className="flex border-2 rounded-lg me-4">
                                    <div className="w-[30px] flex items-center justify-center cursor-pointer" onClick={handleDecreaseCount}>-</div>
                                    <input value={countBicycleChoosen} className="w-[30px] text-center border-s-2 border-e-2 font-bold" onChange={(e) => handleChangeCount(e.target.value)} onBlur={(e) => handleBlur(e.target.value)}/>
                                    <div className="w-[30px] flex items-center justify-center cursor-pointer" onClick={handleIncreaseCount}>+</div>
                                </div>
                                <ButtonCustom radius="md" onClick={handleAddToCart}>Thêm vào giỏ</ButtonCustom>
                            </div>
                            <div className="relative border-1 rounded-xl mb-4">
                                <p className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold py-1 px-4 bg-pri inline-block rounded-md text-white text-nowrap text-sm">KHUYẾN MÃI KHI MUA XE ĐẠP ONLINE</p>
                                <ul className="px-6 text-sm pt-4">
                                    <li className="mb-1">Miễn phí ship giao hàng khi mua xe đạp, không áp dụng với các sản phẩm đang có khuyến mãi từ 50%</li>
                                    <li className="mb-1">Giảm 10% đối với đơn hàng phụ kiện từ 3 món</li>
                                    <li className="mb-1">Giảm 15% đối với đơn hàng phụ kiện từ 5 món</li>
                                </ul>
                            </div>
                            <ButtonCustom className="w-full" radius="lg" onClick={handlePayment}>Mua ngay</ButtonCustom>
                        </div>
                    </section>
                    <Divider className="w-full my-4"/>
                    <section className="w-full block lg:flex">
                        <div className="lg:w-[55%] mb-4 lg:mb-0">
                            <Tabs variant="solid" className="w-full" onSelectionChange={(selectedId => handleChangeTab(selectedId))}>
                                <Tab key="desc" id="desc" title="Mô tả sản phẩm"/>
                                <Tab key="comment" id="comment" title="Bình luận" />
                            </Tabs>
                            <div className="mt-4 text-justify px-4">
                                {showDesc && bicycle?.description}
                                {!showDesc && localStorage.getItem("accessToken") && (

                                    <div>
                                        <div className="flex">
                                            <User avatarProps={{
                                                src: user.avatar
                                            }}/>
                                            <Input className="me-2" value={commentVal} onChange={(e) => setCommentVal(e.target.value)}/>
                                            <Button variant="ghost" color="secondary" onClick={handleAddComment}>Gửi</Button>
                                        </div>
                                        <Divider className="w-full my-2"/>
                                        <div className="mt-4 mb-3">
                                            {
                                                comments.content.map((comment) => (
                                                    <div className="mb-2">
                                                        <div className="flex items-center">
                                                            <User className="me-2" name={comment.fullName} avatarProps={{
                                                                src: comment.avatar
                                                            }}/>
                                                            <p className="text-sm text-slate-500">{formatDay(comment.createAt[0], comment.createAt[1], comment.createAt[2])}</p>
                                                        </div>
                                                        <p className="ms-12">{comment.content}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="w-full flex items-center justify-center">
                                            <Pagination initialPage={page + 1} total={comments.totalPages} onChange={(val) => handleChangePage(val)}/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 lg:ms-6">
                            <div className="text-xl px-2 py-1 mb-2 bg-pri text-white text-center font-bold rounded-lg">THÔNG SỐ KĨ THUẬT</div>
                            <Table>
                                <TableHeader>
                                    <TableColumn>Thông số</TableColumn>
                                    <TableColumn>Giá trị</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell>Chất liệu khung/Frame</TableCell>
                                        <TableCell>{getValueOfBicycle(bicycle?.frame)}</TableCell>
                                    </TableRow>
                                    <TableRow key="2">
                                        <TableCell>Phuộc/Fork</TableCell>
                                        <TableCell>{getValueOfBicycle(bicycle?.fork)}</TableCell>
                                    </TableRow>
                                    <TableRow key="3">
                                        <TableCell>Vành xe/Rims</TableCell>
                                        <TableCell>{getValueOfBicycle(bicycle?.rims)}</TableCell>
                                    </TableRow>
                                    <TableRow key="4">
                                        <TableCell>Đùm/Hubs</TableCell>
                                        <TableCell>{getValueOfBicycle(bicycle?.hubs)}</TableCell>
                                    </TableRow>
                                    <TableRow key="5">
                                        <TableCell>Căm/Spokes</TableCell>
                                        <TableCell>{getValueOfBicycle(bicycle?.spokes)}</TableCell>
                                    </TableRow>
                                    <TableRow key="8">
                                        <TableCell>Lốp xe/Tires</TableCell>
                                        <TableCell>{getValueOfBicycle(bicycle?.tires)}</TableCell>
                                    </TableRow>
                                    <TableRow key="7">
                                        <TableCell>Ghi đông/Handlebar</TableCell>
                                        <TableCell>{getValueOfBicycle(bicycle?.handlebar)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </div>
                    </section>
                    <Divider className="w-full my-4"/>
                    <section className="mt-6">
                        <h1 className="text-2xl font-bold text-pri mb-4">Sản phẩm liên quan</h1>
                        <div className="flex flex-wrap lg:flex-nowrap w-full">
                                {
                                    bicyclesRelevant.map((bicycle, index) => (
                                        <div key={bicycle?.idBicycle} className="w-full mb-4 lg:mb-0 lg:w-1/4 px-2">
                                            <ProductCard bicycle={bicycle}/>
                                        </div>
                                    ))
                                }
                        </div>
                    </section>
                </section>
            </section>
        </HaveSpinner>
    )
}

export default Bicycle;