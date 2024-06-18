import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import SliderItem from "./SliderItem";
import silder_data from "~/assets/static_data/slider_data";
import { Spinner, Tab, Tabs } from "@nextui-org/react";
import ButtonCustom from "~/components/ButtonCustom";
import {
  getAllBicyclesByCategory,
  getAllCategories,
} from "~/services/apiServices/CategoryService";
import formatToVND from "~/utils/formatToVND";
import { Link } from "react-router-dom";
import brand_data from "~/assets/static_data/brand_data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import ProductCard from "~/components/ProductCard";
import HaveSpinner from "~/components/HaveSpinner";

const cx = classNames.bind(styles);

function Home() {
  const [slider, setSlider] = useState(0);
  const [categories, setAllCategories] = useState([]);
  const [bicyclesOfCategory, setBicyclesOfCategory] = useState([]);
  const [loadingSuccessful, setLoadingSuccessful] = useState(false);
  const [loadingBicycle, setLoadingBicycle] = useState(false);
  const [isViewedBicycles, setIsViewedBicycles] = useState([]);
  const [categoryChecked, setCategoryChecked] = useState(1);

  const mapping = useRef({});
  const aboutUsImageRef = useRef(null);
  const aboutUsContentRef = useRef(null);
  const bicycleRefs = useRef([]);
  const brandRefs = useRef([]);
  const bgImageRef = useRef(null);
  const btnMoreRef = useRef(null);

  const sliderPresentTime = 10000;

  useEffect(() => {
    const idInterval = setInterval(() => {
      setSlider((prev) => (prev + 1) % silder_data.length);
    }, sliderPresentTime);
    return () => {
      clearInterval(idInterval);
    };
  }, []);

  const handleGetAllCategories = async () => {
    const categories = (await getAllCategories()) || [];
    const obj = {};
    categories.forEach((category, index) => {
      obj[index] = category.idBicycleCategory;
    });
    mapping.current.value = obj;
    return categories;
  };

  const handleGetDataWhenLoadPage = async () => {
    const categories = await handleGetAllCategories();
    await handleGetBicyclesByCategory(categoryChecked);
    setLoadingSuccessful(true);
    setAllCategories(categories);
  };

  const handleGetBicyclesByCategory = async (idBicycleCategory) => {
    setCategoryChecked(idBicycleCategory);
    setLoadingBicycle(false);
    let bicycles = await getAllBicyclesByCategory(idBicycleCategory);
    bicycles = bicycles.length > 6 ? bicycles.slice(0, 6) : bicycles;
    bicycleRefs.current = Array(Math.min(bicycles.length, 6))
      .fill()
      .map((_, i) => bicycleRefs.current[i] || React.createRef());
    setLoadingBicycle(true);
    setBicyclesOfCategory(bicycles);
  };

  useEffect(() => {
    handleGetDataWhenLoadPage();
    brandRefs.current = Array(brand_data.length)
      .fill()
      .map((_, i) => brandRefs.current[i] || React.createRef());
  }, []);

  const handleAboutUsImage = () => {
    if (!aboutUsImageRef.current) return;
    const aboutUsImagePostion =
      aboutUsImageRef.current.getBoundingClientRect().top;
    if (aboutUsImagePostion < window.innerHeight - 100) {
      aboutUsImageRef.current.classList.add("transition-all");
      aboutUsImageRef.current.style.transform = "translateY(0)";
      aboutUsImageRef.current.style.opacity = "1";
      aboutUsImageRef.current.style.transitionDuration = "1000ms";
    }
  };

  const handleBtnMore = () => {
    if (!btnMoreRef.current) return;
    const aboutUsImagePostion = btnMoreRef.current.getBoundingClientRect().top;
    if (aboutUsImagePostion < window.innerHeight - 100) {
      btnMoreRef.current.classList.add("transition-all");
      btnMoreRef.current.style.transform = "translateY(0)";
      btnMoreRef.current.style.opacity = "1";
      btnMoreRef.current.style.transitionDuration = "1000ms";
    }
  };

  const handleBgImage = () => {
    if (!bgImageRef.current) return;
    const aboutUsImagePostion = bgImageRef.current.getBoundingClientRect().top;
    if (aboutUsImagePostion < window.innerHeight - 100) {
      bgImageRef.current.classList.add("transition-all");
      bgImageRef.current.style.opacity = "1";
      bgImageRef.current.style.transitionDuration = "1000ms";
    }
  };

  const handleAboutUsContent = () => {
    if (!aboutUsContentRef.current) return;
    const aboutUsImagePostion =
      aboutUsContentRef.current.getBoundingClientRect().top;
    if (aboutUsImagePostion < window.innerHeight - 100) {
      aboutUsContentRef.current.classList.add("transition-all");
      aboutUsContentRef.current.style.transform = "translateX(0)";
      aboutUsContentRef.current.style.opacity = "1";
      aboutUsContentRef.current.style.transitionDuration = "1000ms";
    }
  };

  const handleBicycleRefs = () => {
    bicycleRefs.current.forEach((bicycle, index) => {
      if (!bicycle.current) return;
      const aboutUsImagePostion = bicycle.current.getBoundingClientRect().top;
      if (aboutUsImagePostion < window.innerHeight - 100) {
        bicycle.current.classList.add("transition-all");
        bicycle.current.style.transform = "translateY(0)";
        bicycle.current.style.opacity = "1";
        bicycle.current.style.transitionDuration = "1000ms";
        setIsViewedBicycles((prev) => [...prev, index]);
      }
    });
  };

  const handleBrandRefs = () => {
    brandRefs.current.forEach((brand, index) => {
      if (!brand.current) return;
      const aboutUsImagePostion = brand.current.getBoundingClientRect().top;
      if (aboutUsImagePostion < window.innerHeight - 100) {
        brand.current.classList.add("transition-all");
        brand.current.style.transform = "translateY(0)";
        brand.current.style.opacity = "1";
        brand.current.style.transitionDuration = "1000ms";
      }
    });
  };

  const handleSelectionChange = (selectedId) => {
    handleGetBicyclesByCategory(mapping.current.value[selectedId]);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleAboutUsImage);
    window.addEventListener("scroll", handleAboutUsContent);
    window.addEventListener("scroll", handleBicycleRefs);
    window.addEventListener("scroll", handleBrandRefs);
    window.addEventListener("scroll", handleBgImage);
    window.addEventListener("scroll", handleBtnMore);
    return () => {
      window.removeEventListener("scroll", handleAboutUsImage);
      window.removeEventListener("scroll", handleAboutUsContent);
      window.removeEventListener("scroll", handleBicycleRefs);
      window.removeEventListener("scroll", handleBrandRefs);
      window.removeEventListener("scroll", handleBgImage);
      window.removeEventListener("scroll", handleBtnMore);
    };
  }, [loadingSuccessful]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="relative mt-[94px] xl:mt-[100px]">
      <HaveSpinner showSpinner={loadingSuccessful}>
        <>
          <section
            style={{
              background:
                "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAGQCAIAAABnC3SKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY4MzcxNUYxQTc1NzExRTk5MEJGRDA2QkQ5MkE0QTVGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY4MzcxNUYyQTc1NzExRTk5MEJGRDA2QkQ5MkE0QTVGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjgzNzE1RUZBNzU3MTFFOTkwQkZEMDZCRDkyQTRBNUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjgzNzE1RjBBNzU3MTFFOTkwQkZEMDZCRDkyQTRBNUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5246U/AAAGtklEQVR42uyb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') left top repeat-x rgb(247, 247, 247)",
            }}
            className="slider relative flex h-[650px] min-h-[100px] flex-col justify-center overflow-hidden px-4 pb-24 pt-8 xl:block xl:px-0"
          >
            <SliderItem item={silder_data[slider]} time={sliderPresentTime} />
          </section>

          <section className="about-us px-1 py-12 sm:px-5 md:px-20 xl:px-60">
            <h1 className="mb-14 mt-12 text-center font-sans text-5xl font-bold">
              Về Chúng Tôi
            </h1>
            <div className="flex flex-col items-center lg:flex-row lg:items-start">
              <img
                ref={aboutUsImageRef}
                alt="about-us"
                src={require("~/assets/images/about_us/about_us-3.jpg")}
                className="w-full translate-y-16 px-4 opacity-0 lg:w-1/2 lg:px-0"
                style={{
                  clipPath:
                    "polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)",
                }}
              />
              <div className=" overflow-hidden px-8">
                <div
                  ref={aboutUsContentRef}
                  className="translate-x-28 opacity-0"
                >
                  <p className="mb-4 mt-10 text-justify text-medium leading-relaxed">
                    <b className="text-pri">MONA</b> cung cấp bánh xe carbon
                    chắc chắn, nhẹ, bền cho mọi điều kiện—bao gồm xe đạp điện,
                    xe leo núi và xe đường phố
                  </p>
                  <h2 className="mb-1 text-xl font-bold text-pri">
                    Chúng tôi cung cấp hướng dẫn tốt nhất cho bạn
                  </h2>
                  <p className="mb-4 text-justify text-medium leading-relaxed">
                    Xe đạp nói riêng và các hoạt động thể chất ngoài trời nói
                    chung là vô cùng cần thiết cho sự phát triển toàn diện của
                    các bạn nhỏ cũng như người trưởng thành. Vận động không chỉ
                    giúp nâng cao sức khỏe chống lại bệnh tật, mà còn giúp chúng
                    ta có tinh thần hăng hái, học tập và làm việc hiệu quả hơn.
                  </p>
                  <h2 className="mb-1 text-xl font-bold text-pri">
                    Mục tiêu của chúng tôi
                  </h2>
                  <p className="mb-4 text-justify text-medium leading-relaxed">
                    Đạt chất lượng cao với giá thành hợp lý. Mở rộng thị trường
                    với các dự án xuất khẩu ra nước ngoài.
                  </p>
                  <div className="flex items-center justify-center lg:block">
                    <ButtonCustom radius="md" size="lg">
                      Đọc Thêm
                    </ButtonCustom>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="products mb-24">
            <h1 className="mb-14 mt-12 text-center font-sans text-5xl font-bold">
              Sản Phẩm
            </h1>
            <div className="flex flex-col items-center px-2 font-sans xl:px-40">
              <Tabs
                key="tabs"
                variant="bordered"
                radius="full"
                color="primary"
                className="block w-full"
                onSelectionChange={(selectedId) =>
                  handleSelectionChange(selectedId)
                }
              >
                {categories.map((category, index) => (
                  <Tab
                    key={index}
                    id={category.idBicycleCategory}
                    title={category.name}
                    className="mx-2 p-2 text-sm font-bold"
                  >
                    <div className="relative flex min-h-[400px] w-full flex-wrap">
                      {loadingBicycle &&
                        bicyclesOfCategory.map((bicycle, index) => (
                          <div
                            ref={bicycleRefs.current[index]}
                            className={clsx(
                              "my-4 w-full  px-4  lg:w-1/2 xl:w-1/3",
                              {
                                "translate-y-36 opacity-0":
                                  !isViewedBicycles.includes(index),
                              },
                            )}
                          >
                            <ProductCard bicycle={bicycle} />
                          </div>
                        ))}
                      {!loadingBicycle && (
                        <Spinner
                          color="warning"
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                      )}
                    </div>
                  </Tab>
                ))}
              </Tabs>
              {loadingBicycle && (
                <Link to={`/category/${categoryChecked}`} className="text-sm text-white bg-pri px-4 py-1 rounded-lg font-bold">Xem tất cả</Link>
              )}
            </div>
          </section>

          <section
            style={{
              backgroundImage: `url(${require("~/assets/images/about_us/about_us-2.jpg")})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            ref={bgImageRef}
            className="relative h-[75vh] overflow-hidden opacity-0"
          >
            <p className=" absolute left-[5%] top-1/2 -translate-y-1/2 text-9xl font-bold italic tracking-wider text-warning-400">
              MONA <br></br>MEDIA
            </p>
          </section>

          <section className="mb-12">
            <div className="mt-16 flex w-full flex-wrap px-4 md:px-20 lg:px-52">
              {brand_data.map((item, index) => (
                <div
                  ref={brandRefs.current[index]}
                  className="mb-5 w-full translate-y-12 px-12 py-4 opacity-0 md:mb-0 md:w-1/3"
                >
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="mb-3 text-6xl"
                    />
                    <h1 className="mb-2 text-center text-lg font-bold">
                      {item.heading}
                    </h1>
                    <p className="text-center">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      </HaveSpinner>
    </section>
  );
}

export default Home;
