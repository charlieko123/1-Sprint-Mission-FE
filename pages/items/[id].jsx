import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@contexts/AuthProvider";

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProduct(response.data);
    } catch (error) {
      setError("상품 정보를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && productId && user) {
      fetchProduct();
    }
  }, [router.isReady, productId]);

  if (isLoading) return <p>로딩중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {product && (
        <>
          <h1>{product.name}</h1>
          <p>가격: {product.price}원</p>
          <p>설명: {product.description}</p>
          <p>작성자: {product.ownerNickname}</p>
        </>
      )}
      <button onClick={() => router.push("/items")}>목록으로 돌아가기</button>
    </div>
  );
};

export default ProductDetail;
