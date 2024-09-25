import styles from "@styles/Items.module.css";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@components/Pagination";

import defaultImage from "@images/panda_image.png";

export default function Items() {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/products`, {
        params: { page, pageSize },
      });
      setProducts(response.data.list);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("products fetching Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const totalPage = Math.ceil(totalCount / pageSize);

  return (
    <div className={styles.itemsContainer}>
      <h1 className={`text-xl bold`}>상품 목록</h1>

      {isLoading ? (
        <p>로딩중...</p>
      ) : (
        <div className={styles.productList}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <Link href={`/items/${product.id}`}>
                  <Image
                    src={
                      product.images.length > 0
                        ? product.images[0]
                        : defaultImage
                    }
                    alt={product.name}
                    width={220}
                    height={220}
                    className={styles.productImage}
                  />
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <p>가격: {product.price}원</p>
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
