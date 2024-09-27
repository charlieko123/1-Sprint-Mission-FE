import { AuthContext } from "@/src/contexts/AuthProvider";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { fetchProductDetail, updateProduct } from "@api/productApi";

const EditProduct = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchProductDetail(productId, token);

      if (user?.id !== response.data.ownerId) {
        alert("권한이 없습니다.");
        return router.push(`/items/${productId}`);
      }

      setProduct({
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
        tags: response.data.tags,
      });
    } catch (error) {
      setError("상품 정보를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await updateProduct(productId, product, token);
      alert("상품 수정이 완료되었습니다.");

      router.push(`/items/${productId}`);
    } catch (error) {
      alert("상품 수정 중 문제가 발생했습니다.");
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
      <h1>상품 수정하기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>상품 이름</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>설명</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>가격</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>태그</label>
          <input
            type="text"
            name="tags"
            value={product.tags.join(", ")}
            onChange={(e) =>
              setProduct((prevProduct) => ({
                ...prevProduct,
                tags: e.target.value.split(",").map((tag) => tag.trim()),
              }))
            }
          />
        </div>
        <button type="submit">저장하기</button>
        <button
          type="button"
          onClick={() => router.push(`/items/${productId}`)}
        >
          취소
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
