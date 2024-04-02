import { Card, CardBody, Image } from "@nextui-org/react";
import { Link } from "react-router-dom";
import formatToVND from "~/utils/formatToVND";
import classNames from "classnames/bind";
import styles from "./ProductCard.module.scss";

const cx = classNames.bind(styles);

function ProductCard({ bicycle, className }) {
  const classNames = cx("block", className);
  return (
    <Link to={`/bicycle/${bicycle.idBicycle}`} classNames={classNames}>
      <Card isFooterBlurred>
        <CardBody>
          <Image
            isZoomed
            alt="Bicycle"
            className="w-100 object-cover"
            src={bicycle.bicycleImages[0].source}
          />
          <div className="px-3">
            <p className={cx("mt-3 text-lg font-bold", "truncate-text")}>
              {bicycle.name}
            </p>
            <p className="mt-3 text-2xl font-bold text-danger">
              {formatToVND(bicycle.price)}
            </p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default ProductCard;
