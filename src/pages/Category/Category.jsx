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
import {
  getAllBicycles,
  getAllColors,
  getAllSizes,
  getBicyclesWithPagination,
  getBicyclesWithPaginationAndSorting,
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

  const totalBicycles = useRef({});
  const limit = 6;

  const handleLoadData = async () => {
    const categories = await getAllCategories();
    const sizes = await getAllSizes();
    const colors = await getAllColors();
    const bicycles = await getBicyclesWithPagination(0, limit);
    const allBicycles = await getAllBicycles();
    totalBicycles.current.value = allBicycles.length;
    setCategories(categories);
    setSizes(sizes);
    setColors(colors);
    setBicycles(bicycles);
    setIsLoadedData(true);
    setIsLoadedBicycles(true);
  };

  const handleGetBicyclesByPage = async (page) => {
    setIsLoadedBicycles(false);
    let bicycles;
    if (sortVal) {
      bicycles = await await getBicyclesWithPaginationAndSorting(
        sortVal,
        page - 1,
        limit,
        "price",
      );
    } else {
      bicycles = await getBicyclesWithPagination(page - 1, limit);
    }
    setBicycles(bicycles);
    setCurrPage(page);
    setIsLoadedBicycles(true);
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
      limit,
      "price",
    );
    setBicycles(bicycles);
    setIsLoadedBicycles(true);
    setSortVal(`${value}`);
  };

  useEffect(() => {
    handleLoadData();
  }, []);

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
                    <Checkbox value={category.idBicycleCategory}>
                      {`${category.name} (${category.countOfBicycles})`}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <Divider className="my-2 w-3/4" />
              <div className="mb-6">
                <CheckboxGroup label="Màu Sắc">
                  {colors.map((color, index) => (
                    <Checkbox value={color.idBicycleColor}>
                      {color.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <Divider className="my-2 w-3/4" />
              <div>
                <CheckboxGroup label="Kích Thước">
                  {sizes.map((size, index) => (
                    <Checkbox value={size.idBicycleSize}>{size.name}</Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </div>
            <div className="relative flex-1">
              {isLoadedBicycles && (
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
                      total={totalBicycles.current.value / limit}
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
