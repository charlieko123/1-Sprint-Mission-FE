import React, { useState, useEffect } from "react";
import { fetchProducts } from "@api/productApi.js";
import Product from "@components/Product";
import usePageSize from "@hooks/usePageSize.js";
import styles from "@styles/BestProductsMain.module.css";

function BestProductsMain() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageSize = usePageSize(1, 2, 4); // 모바일 태블릿 데스크탑 출력 개수

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(1, pageSize);
        setProducts(data.list);
      } catch (error) {
        console.error("load products fail", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [pageSize]);

  if (loading) <p>로딩중...</p>;

  return (
    <>
      <h2 className={`${styles.bestProductTitle} text-xl bold`}>베스트 상품</h2>
      <div className={styles.bestProducts}>
        {products.map((product) => (
          <Product
            key={`product-${product.id}`}
            product={product}
            className={styles.bestProduct}
          />
        ))}
      </div>
    </>
  );
}

export default BestProductsMain;
