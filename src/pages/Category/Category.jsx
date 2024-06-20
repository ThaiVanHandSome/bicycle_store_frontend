import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Checkbox,
  CheckboxGroup,
  Divider,
  Pagination,
  Select,
  SelectItem,
  Slider,
  Spinner,
} from "@nextui-org/react";
import { Drawer } from "antd";
import { useEffect, useReducer, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import HaveSpinner from "~/components/HaveSpinner";
import ProductCard from "~/components/ProductCard";
import routes from "~/config/routes";
import { useToast } from "~/context/ToastContext";
import { useDebounced } from "~/hooks/useDebounced";
import {
  getAllColors,
  getAllSizes,
  postFilterBicycles,
} from "~/services/apiServices/BicycleService";
import { getAllCategories } from "~/services/apiServices/CategoryService";
import { useTryCatch } from "~/hooks/useTryCatch";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        [action.array]: action.newArr
      }
    case "UPDATE_PRICE":
      return {
        ...state,
        maxPrice: action.price
      }
    default:
      return state;
  }
}

function Categories() {
  const openNotification = useToast();
  const { id } = useParams();

  const [open, setOpen] = useState(false);

  const {handleTryCatch} = useTryCatch();

  const [categories, setCategories] = useState([]);
  const [bicycles, setBicycles] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [maxPrice, setMaxPrice] = useState(200000000);
  const [isLoadedData, setIsLoadedData] = useState(false);
  const [isLoadedBicycles, setIsLoadedBicycles] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [sortVal, setSortVal] = useState("none");

  const initState = {
    categoriesChecked: id === "all" ? [] : [parseInt(id)],
    colorsChecked: [],
    sizesChecked: [],
    maxPrice: 200000000
  }
  
  const [state, dispatch] = useReducer(reducer, initState);
  let debouncedState = useDebounced(state, 1000);

  const totalBicycles = useRef(0);
  const limitRef = useRef(6);

  // lấy dữ liệu khi lần đầu load trang web
  const handleLoadData = async () => {
    await handleTryCatch(async () => {
      const categoriesRes = await getAllCategories();
      if(categoriesRes.status === "success") setCategories(categoriesRes.data);
      const sizesRes = await getAllSizes();
      if(sizesRes.status === "success") setSizes(sizesRes.data);
      const colorsRes = await getAllColors();
      if(colorsRes.status === "success") setColors(colorsRes.data);
      const filterRes = await postFilter(
        initState.categoriesChecked,
        initState.colorsChecked,
        initState.sizesChecked,
        maxPrice,
        "none",
        1
      );
      if(filterRes.status === "success") {
        const {totalProducts, bicycles} = filterRes.data;
        setBicycles(bicycles);
        totalBicycles.current = totalProducts;
      }
      
      setCurrPage(1);
      setSortVal("none");
      setIsLoadedData(true);
      setIsLoadedBicycles(true);
    });
  };

  // set bicycles mới và set trạng thái đã load thành công data
  const handleSetBicycles = (bicycles) => {
    setBicycles(bicycles);
    setIsLoadedBicycles(true);
  };

  // set dữ liệu mới khi chọn trang mới
  const handleGetBicyclesByPage = async (page) => {
    await handleTryCatch(async () => {
      setIsLoadedBicycles(false);
      const {totalProducts, bicycles} = await postFilter(
        debouncedState.categoriesChecked,
        debouncedState.colorsChecked,
        debouncedState.sizesChecked,
        maxPrice,
        sortVal,
        page
      );
      setCurrPage(page);
      totalBicycles.current = totalProducts;
      handleSetBicycles(bicycles);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  // lấy dữ liệu mới khi chọn selection mới
  const handleChangeSelection = async (value) => {
    await handleTryCatch(async () => {
      setIsLoadedBicycles(false);
      setSortVal(value);
      const {totalProducts, bicycles} = await postFilter(
        debouncedState.categoriesChecked,
        debouncedState.colorsChecked,
        debouncedState.sizesChecked,
        maxPrice,
        value,
        1
      );
      totalBicycles.current = totalProducts;
      setCurrPage(1);
      handleSetBicycles(bicycles);
    });
  };

  // gửi yêu cầu lọc và nhận về dữ liệu tương ứng
  const postFilter = async (
    categories,
    colors,
    sizes,
    maxPrice = 100000000,
    sort,
    page
  ) => {
    const finalRes = await handleTryCatch(async () => {
      const data = {
        bicycleCategoriesId: categories,
        bicycleColorsId: colors,
        bicycleSizesId: sizes,
        maxPrice: maxPrice,
      };
      const res = await postFilterBicycles(data, page - 1, limitRef.current, sort);
      return res;
    });
    return finalRes;
  };

  // lấy dữ liệu mới khi chọn điều kiện lọc mới
  const handleGetBicyclesWhenFilter = async () => {
    await handleTryCatch(async () => {
      if(!debouncedState) return;
      const {totalProducts, bicycles} = await postFilter(
        debouncedState.categoriesChecked,
        debouncedState.colorsChecked,
        debouncedState.sizesChecked,
        maxPrice,
        sortVal,
        1
      );
      totalBicycles.current = totalProducts;
      setCurrPage(1);
      handleSetBicycles(bicycles);
    });
  };

  // thay đổi mảng chưa id tương ứng khi check hoặc uncheck checkbox
  const handleToggleState = (val, array) => {
    setIsLoadedBicycles(false);
    dispatch({
      type: 'UPDATE',
      newArr: val,
      array
    })
  };

  // thay đổi state khi chọn miền price mới
  const handleChangePrice = (price) => {
    setIsLoadedBicycles(false);
    setMaxPrice(price);
    dispatch({
      type: "UPDATE_PRICE",
      price: price
    })
  }

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // mỗi lần debouncedState thay đổi, thực hiện get lấy dữ liệu mới
  useEffect(() => {
    handleGetBicyclesWhenFilter();
  }, [debouncedState])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    handleLoadData();
  }, [id]);


  return (
    <section key={id} className="category relative mt-[100px] px-12 md:px-20 lg:px-30 xl:px-44 py-12">
      <HaveSpinner showSpinner={isLoadedData}>
        <>
          <FontAwesomeIcon className="block lg:hidden fixed top-1/2 left-6 -translate-x-1/2 text-4xl bg-white" icon={faBars} onClick={showDrawer}/>
          <div className="flex items-center justify-center flex-col md:flex-row">
            <Breadcrumbs
              variant="solid"
              color="warning"
              className="w-2/3 mb-2 md:mb-0 flex justify-center md:block"
              radius="full"
              size="lg"
            >
              <BreadcrumbItem href={routes.home}>Trang chủ</BreadcrumbItem>
              <BreadcrumbItem>Cửa hàng</BreadcrumbItem>
              {id !== "all" && <BreadcrumbItem>{id}</BreadcrumbItem>}
            </Breadcrumbs>
            <Select
              className="flex-1"
              label="Lọc Sản Phẩm"
              onChange={(e) => handleChangeSelection(e.target.value)}
            >
              <SelectItem key="asc" value="asc">
                Thứ tự theo giá: Thấp Đến Cao
              </SelectItem>
              <SelectItem key="desc" value="desc">
                Thứ tự theo giá: Cao Đến Thấp
              </SelectItem>
            </Select>
          </div>
          <Divider className="my-4" />
          <div className="mt-6 flex">
            <div className="side-bar h-[100vh] w-1/3 hidden lg:block">
              {
                id === "all" && (
                    <>
                        <div className="mb-6">
                            <CheckboxGroup label="Danh Mục Sản Phẩm" onChange={(newVal) => handleToggleState(newVal, "categoriesChecked")}>
                            {categories.map((category, index) => (
                                <Checkbox
                                value={category.idBicycleCategory}
                                >
                                {`${category.name} (${category.countOfBicycles})`}
                                </Checkbox>
                            ))}
                            </CheckboxGroup>
                        </div>
                        <Divider className="my-2 w-3/4" />
                    </>
                )
              }
              <div className="mb-6">
                <CheckboxGroup label="Màu Sắc" onChange={(newVal) => handleToggleState(newVal, "colorsChecked")}>
                  {colors.map((color, index) => (
                    <Checkbox
                      value={color.idBicycleColor}                     
                    >
                      {color.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <Divider className="my-2 w-3/4" />
              <div>
                <CheckboxGroup label="Kích Thước" onChange={(newVal) => handleToggleState(newVal, "sizesChecked")}>
                  {sizes.map((size, index) => (
                    <Checkbox
                      value={size.idBicycleSize}
                    >
                      {size.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <Divider className="my-2 w-3/4" />
              <div>
                <Slider 
                  label='Giá'
                  step={1000}
                  minValue={0}
                  maxValue={200000000}
                  defaultValue={200000000}
                  className="w-3/4 mt-2"
                  onChange={(val) => handleChangePrice(val)}
                />
                
              </div>
            </div>
            <Drawer
              title="Filter"
              placement="left"
              closable={false}
              open={open}
              onClose={onClose}
            >
              {
                id === "all" && (
                  <>
                    <div className="mb-6">
                      <CheckboxGroup label="Danh Mục Sản Phẩm" onChange={(newVal) => handleToggleState(newVal, "categoriesChecked")}>
                        {categories.map((category, index) => (
                          <Checkbox
                            value={category.idBicycleCategory}
                          >
                            {`${category.name} (${category.countOfBicycles})`}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>
                    <Divider className="my-2 w-full" />
                  </>
                )
              }
              <div className="mb-6">
                <CheckboxGroup label="Màu Sắc" onChange={(newVal) => handleToggleState(newVal, "colorsChecked")}>
                  {colors.map((color, index) => (
                    <Checkbox
                      value={color.idBicycleColor}                     
                    >
                      {color.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <Divider className="my-2 w-full" />
              <div>
                <CheckboxGroup label="Kích Thước" onChange={(newVal) => handleToggleState(newVal, "sizesChecked")}>
                  {sizes.map((size, index) => (
                    <Checkbox
                      value={size.idBicycleSize}
                    >
                      {size.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <Divider className="my-2 w-full" />
              <div>
                <Slider 
                  label='Giá'
                  step={1000}
                  minValue={0}
                  maxValue={200000000}
                  defaultValue={200000000}
                  className="w-3/4 mt-2"
                  onChange={(val) => handleChangePrice(val)}
                />
                </div>
            </Drawer>
            <div className="relative flex-1">
              {isLoadedBicycles && bicycles && (
                <>
                  <div className="flex flex-wrap">
                    {bicycles.map((bicycle, index) => (
                      <div className="mb-6 w-full md:w-1/2 xl:w-1/3 px-3">
                        <ProductCard bicycle={bicycle} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    <Pagination
                      total={totalBicycles.current % limitRef.current === 0 ? totalBicycles.current / limitRef.current : totalBicycles.current / limitRef.current + 1}
                      initialPage={currPage}
                      onChange={(page) => handleGetBicyclesByPage(page)}
                    />
                  </div>
                </>
              )}
              {!isLoadedBicycles && (
                <Spinner
                  color="warning"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              )}
            </div>
          </div>
        </>
      </HaveSpinner>
    </section>
  );
}

export default Categories;
