import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HaveSpinner from "~/components/HaveSpinner";
import { GlassIcon } from "~/components/Icon/Icon";
import ProductCard from "~/components/ProductCard";
import { useTryCatch } from "~/hooks/useTryCatch";
import { searchBicycle } from "~/services/apiServices/BicycleService";

function Search() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let nameSearched = searchParams.get("name");

    const { handleTryCatch } = useTryCatch();
    const [bicycles, setBicycles] = useState([]);
    const [isLoadedData, setIsLoadedData] = useState(false);

    const handleGetInitData = async () => {
        await handleTryCatch(async () => {
            const bicyclesRes = await searchBicycle(nameSearched);
            if(bicyclesRes.status === "success") {
                setBicycles(bicyclesRes.data);
                setIsLoadedData(true);
            }
        })
    }

    useEffect(() => {
        setIsLoadedData(false);
        handleGetInitData();
    }, [nameSearched]);
    return (
        <HaveSpinner hideSpinner={isLoadedData}>
            <section className="px-2 lg:px-24 py-6">
                <h1 className="font-bold text-2xl mb-4 flex items-center"> <GlassIcon width={20} height={20}/> <span className="ms-2">Kết quả tìm kiếm - <span className="text-pri text-lg">{bicycles.length} sản phẩm</span></span></h1>
                <div className="flex flex-wrap -mx-2">
                    {
                        bicycles.map((bicycle) => (
                            <div className="w-full lg:w-1/4 px-2 mb-4" key={bicycle.idBicycle}>
                                <ProductCard bicycle={bicycle}/>
                            </div>
                        ))
                    }
                </div>
        </section>
        </HaveSpinner>
    );
}

export default Search;