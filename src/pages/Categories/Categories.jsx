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
import { type } from "@testing-library/user-event/dist/type";
import { Drawer } from "antd";
import { useEffect, useReducer, useRef, useState } from "react";
import ProductCard from "~/components/ProductCard";
import routes from "~/config/routes";
import { useDebounced } from "~/hooks/useDebounced";
import {
  getAllBicycles,
  getAllColors,
  getAllSizes,
  getBicyclesWithPagination,
  getBicyclesWithPaginationAndSorting,
  postFilterBicycles,
} from "~/services/apiServices/BicycleService";
import { getAllCategories } from "~/services/apiServices/CategoryService";



const initState = {
  categoriesChecked: [],
  colorsChecked: [],
  sizesChecked: [],
  maxPrice: 200000000
}

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
  const [open, setOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [bicycles, setBicycles] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [maxPrice, setMaxPrice] = useState(200000000);
  const [isLoadedData, setIsLoadedData] = useState(false);
  const [isLoadedBicycles, setIsLoadedBicycles] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [sortVal, setSortVal] = useState("none");

  const [state, dispatch] = useReducer(reducer, initState);
  const debouncedState = useDebounced(state, 1000);

  const totalBicycles = useRef(0);
  const limitRef = useRef(6);

  const handleLoadData = async () => {
    const categories = await getAllCategories();
    const sizes = await getAllSizes();
    const colors = await getAllColors();
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
    setCategories(categories);
    setSizes(sizes);
    setColors(colors);
    setBicycles(bicycles);
    setIsLoadedData(true);
    setIsLoadedBicycles(true);
  };

  const handleSetBicycles = (bicycles) => {
    setBicycles(bicycles);
    setIsLoadedBicycles(true);
  };

  const handleGetBicyclesByPage = async (page) => {
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
  };

  const handleChangeSelection = async (value) => {
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
  };

  const postFilter = async (
    categories,
    colors,
    sizes,
    maxPrice = 100000000,
    sort,
    page
  ) => {
    const data = {
      bicycleCategoriesId: categories,
      bicycleColorsId: colors,
      bicycleSizesId: sizes,
      maxPrice: maxPrice,
    };
    const res = await postFilterBicycles(data, page - 1, limitRef.current, sort);
    return res;
  };

  const handleGetBicyclesWhenFilter = async () => {
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
  };

  const handleToggleState = (val, array) => {
    setIsLoadedBicycles(false);
    dispatch({
      type: 'UPDATE',
      newArr: val,
      array
    })
  };

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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    handleLoadData();
  }, []);

  useEffect(() => {
    handleGetBicyclesWhenFilter();
  }, [debouncedState])

  return (
    <section className="category relative mt-[100px] min-h-[100vh] px-12 md:px-20 lg:px-30 xl:px-44 py-12">
      {isLoadedData && (
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
              <BreadcrumbItem href={routes.home}>Home</BreadcrumbItem>
              <BreadcrumbItem>Category</BreadcrumbItem>
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
      )}
      {!isLoadedData && (
        <Spinner
          color="warning"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </section>
  );
}

export default Categories;