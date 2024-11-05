import React from "react";
import styles from "@styles/Product.module.css";
import Image from "next/image";

import heartEmptyImage from "../images/favoriteEmptyHeart-small.png";
import defaultPanda from "@images/panda_image.png";

const Product = ({ product, className }) => {
  const favoriteCountDefault = 1;
  return (
    <div>
      <Image
        className="product-image"
        src={defaultPanda}
        alt={product.description}
        width={282}
        height={282}
      />
      <p className="description text-md medium">{product.description}</p>
      <p className="price text-lg bold">
        {product.price.toLocaleString("en-US")}원
      </p>
      <div className="favorites">
        <Image
          className="favorite-heart"
          src={heartEmptyImage}
          alt="favorite heart"
          width={16}
          height={16}
        />
        <p className="favorite-count text-xs medium">{favoriteCountDefault}</p>
      </div>
    </div>
  );
};

export default Product;
