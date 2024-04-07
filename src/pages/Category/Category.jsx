import {
  BreadcrumbItem,
  Breadcrumbs,
  Checkbox,
  CheckboxGroup,
  Divider,
  Pagination,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
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

function Category() {
  const [categories, setCategories] = useState([]);
  const [bicycles, setBicycles] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [isLoadedData, setIsLoadedData] = useState(false);
  const [isLoadedBicycles, setIsLoadedBicycles] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [sortVal, setSortVal] = useState(null);

  const [categoriesChecked, setCategoriesChecked] = useState([]);
  const [colorsChecked, setColorsChecked] = useState([]);
  const [sizesChecked, setSizesChecked] = useState([]);
  const [toggleChangeFilter, setToggleChangeFilter] = useState(false);

  const totalBicycles = useRef({});
  const limitRef = useRef(6);

  const canCallAPI = useDebounced(toggleChangeFilter, 500);

  const handleLoadData = async () => {
    const categories = await getAllCategories();
    const sizes = await getAllSizes();
    const colors = await getAllColors();
    const bicycles = await getBicyclesWithPagination(0, limitRef.current);
    const allBicycles = await getAllBicycles();

    totalBicycles.current.value = allBicycles.length;
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
    let bicycles;
    if (sortVal) {
      bicycles = await await getBicyclesWithPaginationAndSorting(
        sortVal,
        page - 1,
        limitRef.current,
        "price",
      );
    } else {
      bicycles = await getBicyclesWithPagination(page - 1, limitRef.current);
    }
    setCurrPage(page);
    handleSetBicycles(bicycles);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleChangeSelection = async (value) => {
    setIsLoadedBicycles(false);
    const bicycles = await getBicyclesWithPaginationAndSorting(
      `${value}`,
      currPage - 1,
      limitRef.current,
      "price",
    );
    setSortVal(`${value}`);
    handleSetBicycles(bicycles);
  };

  const postFilter = async (
    categories,
    colors,
    sizes,
    maxPrice = 100000000,
  ) => {
    const data = {
      bicycleCategoriesId: categories,
      bicycleColorsId: colors,
      bicycleSizesId: sizes,
      maxPrice: maxPrice,
    };
    const res = await postFilterBicycles(data);
    return res;
  };

  const handleGetBicyclesWhenFilter = async () => {
    const bicycleFilter = await postFilter(
      categoriesChecked,
      colorsChecked,
      sizesChecked,
    );
    limitRef.current = bicycleFilter.length;
    handleSetBicycles(bicycleFilter);
  };

  const handleToggleState = async (e, val, setState) => {
    setIsLoadedBicycles(false);
    setState((prev) => {
      let nextState = [...prev];
      if (!e.target.checked) {
        nextState = [...nextState, val];
      } else {
        let index = nextState.indexOf(val);
        if (index !== -1) {
          nextState.splice(index, 1);
        }
      }
      return nextState;
    });
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
  }, [canCallAPI]);

  return (
    <section className="category relative mt-[100px] min-h-[100vh] px-44 py-12">
      {isLoadedData && (
        <>
          <div className="flex items-center">
            <Breadcrumbs
              variant="solid"
              color="warning"
              className="w-2/3"
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
            <div className="side-bar h-[100vh] w-1/3">
              <div className="mb-6">
                <CheckboxGroup label="Danh Mục Sản Phẩm">
                  {categories.map((category, index) => (
                    <Checkbox
                      value={category.idBicycleCategory}
                      onClick={(e) =>
                        handleToggleState(
                          e,
                          category.idBicycleCategory,
                          setCategoriesChecked,
                        )
                      }
                    >
                      {`${category.name} (${category.countOfBicycles})`}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <Divider className="my-2 w-3/4" />
              <div className="mb-6">
                <CheckboxGroup label="Màu Sắc">
                  {colors.map((color, index) => (
                    <Checkbox
                      value={color.idBicycleColor}
                      onClick={(e) =>
                        handleToggleState(
                          e,
                          color.idBicycleColor,
                          setColorsChecked,
                        )
                      }
                    >
                      {color.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <Divider className="my-2 w-3/4" />
              <div>
                <CheckboxGroup label="Kích Thước">
                  {sizes.map((size, index) => (
                    <Checkbox
                      value={size.idBicycleSize}
                      onClick={(e) =>
                        handleToggleState(
                          e,
                          size.idBicycleSize,
                          setSizesChecked,
                        )
                      }
                    >
                      {size.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </div>
            <div className="relative flex-1">
              {isLoadedBicycles && bicycles && (
                <>
                  <div className="flex flex-wrap">
                    {bicycles.map((bicycle, index) => (
                      <div className="mb-6 w-1/3 px-3">
                        <ProductCard bicycle={bicycle} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    <Pagination
                      total={totalBicycles.current.value / limitRef.current}
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

export default Category;
