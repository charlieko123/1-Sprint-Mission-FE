import { AuthContext } from "@/src/contexts/AuthProvider";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { fetchProductDetail, updateProduct } from "@api/productApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EditProduct = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    tags: [],
  });
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  if (!router.isReady) {
    return <p>로딩중...</p>;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    router.push("/login");
    return null;
  }

  const {
    data: productData,
    isLoading,
    error,
  } = useQuery(
    ["product", productId],
    () => fetchProductDetail(productId, token),
    {
      enabled: !!productId && !!user,
      staleTime: 1000 * 60 * 5,
    }
  );

  useEffect(() => {
    if (productData) {
      if (user?.id !== productData.ownerId) {
        alert("권한이 없습니다.");
        router.push(`/items/${productId}`);
      } else {
        setProduct({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          tags: productData.tags,
        });
      }
    }
  }, [productData, user, productId, router, token]);

  const updateMutation = useMutation(
    async (updatedProduct) => {
      return updateProduct(productId, updatedProduct, token);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["product", productId]);
        alert("상품 수정이 완료되었습니다.");
        router.push(`/items/${productId}`);
      },
      onError: () => {
        alert("상품 수정 중 문제가 발생했습니다.");
      },
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateMutation.mutate(product);
  };

  if (isLoading) return <p>로딩중...</p>;
  if (error) return <p>{error.message}</p>;

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
        <button type="submit" disabled={updateMutation.isLoading}>
          저장하기
        </button>
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
