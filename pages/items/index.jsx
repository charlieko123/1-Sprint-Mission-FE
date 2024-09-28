import styles from "@styles/Items.module.css";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@components/Pagination";
import { fetchProducts } from "@api/productApi";
import { useQuery } from "@tanstack/react-query";

import defaultImage from "@images/panda_image.png";

export default function Items() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useQuery(
    ["products", currentPage],
    () => fetchProducts(currentPage, pageSize),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    }
  );

  const products = data?.list || [];
  const totalCount = data?.totalCount || 0;

  const totalPage = Math.ceil(totalCount / pageSize);

  return (
    <div className={styles.itemsContainer}>
      <h1 className={`text-xl bold`}>상품 목록</h1>

      {isLoading ? (
        <p>로딩중...</p>
      ) : isError ? (
        <p>상품 정보를 불러오는 중 문제가 발생했습니다.</p>
      ) : (
        <div className={styles.productList}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <Link href={`/items/${product.id}`} className={styles.a}>
                  <Image
                    src={
                      product.images.length > 0
                        ? product.images[0]
                        : defaultImage
                    }
                    alt={product.name}
                    width={218}
                    height={218}
                    className={styles.productImage}
                  />
                  <h2 className={`${styles.name} text-xs`}>{product.name}</h2>
                  <p className={`${styles.description} text-xs`}>
                    {product.description}
                  </p>
                  <p className={`${styles.price} text-xs semibold`}>
                    가격: {product.price}원
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <p>상품이 없습니다.</p>
          )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
