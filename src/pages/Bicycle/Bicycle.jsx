import { faCircleArrowLeft, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "@nextui-org/react";
import { Carousel } from "antd";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getBicycleById } from "~/services/apiServices/BicycleService";

function Bicycle() {
    const { id } = useParams();
    const [isLoadedData, setIsLoadedData] = useState(false);
    const [bicycle, setBicycle] = useState(null);
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

    const getInitData = async () => {
        const bicycleData = await getBicycleById(id);
        setBicycle(bicycleData);
        setIsLoadedData(true);
    }

    useEffect(() => {
        getInitData();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            {
                isLoadedData && (
                    <section className="mt-[100px] px-28 py-2 flex">
                        <div className="w-1/2 me-4 group">
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