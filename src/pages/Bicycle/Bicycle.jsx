import { faCircleArrowLeft, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Spinner, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@nextui-org/react";
import { Carousel } from "antd";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ButtonCustom from "~/components/ButtonCustom";
import { getBicycleById } from "~/services/apiServices/BicycleService";
import { getAllCategoriesOfBicycle } from "~/services/apiServices/CategoryService";
import formatToVND from "~/utils/formatToVND";
import { isPossitiveNumber } from "~/utils/number";

function Bicycle() {
    const { id } = useParams();
    const [isLoadedData, setIsLoadedData] = useState(false);
    const [bicycle, setBicycle] = useState(null);
    const [bicycleCategories, setBicycleCategories] = useState(null);

    const [countBicycleChoosen, setCountBicycleChoosen] = useState(1);

    const [showDesc, setShowDesc] = useState(true);

    const [carouselIndexChecked, setCarouselIndexChecked] = useState(0);

    // carousel
    const carouselRef = useRef();

    const handlePrevCarousel = () => {
        carouselRef.current.prev();
        setCarouselIndexChecked(Math.max(carouselRef.current.innerSlider.state.currentSlide - 1, 0));
    }

    const handleNextCarousel = () => {
        carouselRef.current.next();
        setCarouselIndexChecked(Math.min(carouselRef.current.innerSlider.state.currentSlide + 1, bicycle.thumbnails.length - 1));
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
            return;
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

    const getInitData = async () => {
        const bicycleData = await getBicycleById(id);
        const bicycleCategoriesData = await getAllCategoriesOfBicycle(bicycleData.idBicycle);
        setBicycleCategories(bicycleCategoriesData);
        setBicycle(bicycleData);
        setIsLoadedData(true);
    }

    const getValueOfBicycle = (val) => {
        if(val === null) return "N/A";
        return val;
    }

    useEffect(() => {
        getInitData();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            {
                isLoadedData && (
                    <section className="mt-[100px] py-2 px-28">
                        <section className="flex">
                            <div className="w-[40%] me-4 group">
                                <div className="w-full relative">
                                    <FontAwesomeIcon icon={faCircleArrowLeft} className="cursor-pointer absolute top-1/2 left-0 opacity-0 z-10 -translate-y-1/2 text-2xl group-hover:left-2 group-hover:opacity-100 transition-all" onClick={handlePrevCarousel}/>
                                    <FontAwesomeIcon icon={faCircleArrowRight} className="cursor-pointer absolute top-1/2 right-0 opacity-0 z-10 -translate-y-1/2 text-2xl group-hover:right-2 group-hover:opacity-100 transition-all" onClick={handleNextCarousel}/>
                                    <Carousel ref={carouselRef} arrows infinite={false} afterChange={handleAfterChange}>
                                        {
                                            bicycle.thumbnails.map((src, index) => {
                                                return (
                                                    <img key={index} src={src} alt="thumbnail"/>
                                                )
                                            })
                                        }
                                    </Carousel>
                                </div>
                                <div className="mt-4 flex">
                                    {
                                        bicycle.thumbnails.map((src, index) => {
                                            return (
                                                <div key={index} className={clsx("w-[100px] me-4 cursor-pointer hover:border-1 hover:border-slate-800 hover:rounded-md", {
                                                    "border-1 rounded-md": carouselIndexChecked === index
                                                })} onClick={() => handleChangeCarouselItem(index)}>
                                                    <img className="rounded-md" src={src} alt="thumbnail"/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="flex-1 px-20 pt-6">
                                <h1 className="text-4xl font-bold mb-2">{bicycle.name}</h1>
                                <h2 className="text-2xl text-danger font-bold mb-2">{formatToVND(bicycle.price)}</h2>
                                <p className="mb-2">Mã sản phẩm: <b>{bicycle?.idBicycle}</b></p>
                                <div className="mb-2">
                                    Danh mục sản phẩm: {
                                        bicycleCategories.map((category, index) => (
                                            <Link key={category.idCategory} to={`/category/${category.idCategory}`} className="hover:text-pri hover:font-bold transition-all me-2">{category.name}</Link>
                                        ))
                                    }
                                </div>
                                <div className="flex mb-8">
                                    <div className="flex border-2 rounded-lg me-4">
                                        <div className="w-[30px] flex items-center justify-center cursor-pointer" onClick={handleDecreaseCount}>-</div>
                                        <input value={countBicycleChoosen} className="w-[30px] text-center border-s-2 border-e-2 font-bold" onChange={(e) => handleChangeCount(e.target.value)} onBlur={(e) => handleBlur(e.target.value)}/>
                                        <div className="w-[30px] flex items-center justify-center cursor-pointer" onClick={handleIncreaseCount}>+</div>
                                    </div>
                                    <ButtonCustom radius="md">Thêm vào giỏ</ButtonCustom>
                                </div>
                                <div className="relative border-1 rounded-xl mb-4">
                                    <p className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold py-1 px-4 bg-pri inline-block rounded-md text-white text-nowrap text-sm">KHUYẾN MÃI KHI MUA XE ĐẠP ONLINE</p>
                                    <ul className="px-6 text-sm pt-4">
                                        <li className="mb-1">Miễn phí ship giao hàng khi mua xe đạp, không áp dụng với các sản phẩm đang có khuyến mãi từ 50%</li>
                                        <li className="mb-1">Giảm 10% đối với đơn hàng phụ kiện từ 3 món</li>
                                        <li className="mb-1">Giảm 15% đối với đơn hàng phụ kiện từ 5 món</li>
                                    </ul>
                                </div>
                                <ButtonCustom className="w-full" radius="lg">Mua ngay</ButtonCustom>
                            </div>
                        </section>
                        <Divider className="w-full my-4"/>
                        <section className="w-full flex">
                            <div className="w-[60%]">
                                <Tabs variant="solid" className="w-full" onSelectionChange={(selectedId => handleChangeTab(selectedId))}>
                                    <Tab key="desc" id="desc" title="Mô tả sản phẩm"/>
                                    <Tab key="comment" id="comment" title="Bình luận" />
                                </Tabs>
                                <div className="mt-4 text-justify px-4">
                                    {showDesc && bicycle.description}
                                </div>
                            </div>
                            <div className="flex-1 ms-6">
                                <div className="text-xl px-2 py-1 mb-2 bg-pri text-white text-center font-bold rounded-lg">THÔNG SỐ KĨ THUẬT</div>
                                <Table>
                                    <TableHeader>
                                        <TableColumn>Thông số</TableColumn>
                                        <TableColumn>Giá trị</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key="1">
                                            <TableCell>Chất liệu khung/Frame</TableCell>
                                            <TableCell>{getValueOfBicycle(bicycle.frame)}</TableCell>
                                        </TableRow>
                                        <TableRow key="2">
                                            <TableCell>Phuộc/Fork</TableCell>
                                            <TableCell>{getValueOfBicycle(bicycle.fork)}</TableCell>
                                        </TableRow>
                                        <TableRow key="3">
                                            <TableCell>Vành xe/Rims</TableCell>
                                            <TableCell>{getValueOfBicycle(bicycle.rims)}</TableCell>
                                        </TableRow>
                                        <TableRow key="4">
                                            <TableCell>Đùm/Hubs</TableCell>
                                            <TableCell>{getValueOfBicycle(bicycle.hubs)}</TableCell>
                                        </TableRow>
                                        <TableRow key="5">
                                            <TableCell>Căm/Spokes</TableCell>
                                            <TableCell>{getValueOfBicycle(bicycle.spokes)}</TableCell>
                                        </TableRow>
                                        <TableRow key="8">
                                            <TableCell>Lốp xe/Tires</TableCell>
                                            <TableCell>{getValueOfBicycle(bicycle.tires)}</TableCell>
                                        </TableRow>
                                        <TableRow key="7">
                                            <TableCell>Ghi đông/Handlebar</TableCell>
                                            <TableCell>{getValueOfBicycle(bicycle.handlebar)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                            </div>
                        </section>
                    </section>
                )
            }
            {
                !isLoadedData && (
                <Spinner color="warning" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"/>
                )
            }
        </>
    )
}

export default Bicycle;