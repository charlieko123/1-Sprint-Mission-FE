import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@contexts/AuthProvider";
import Image from "next/image";
import KebabDropdown from "@components/KebabDropdown";
import ConfirmModal from "@components/ConfirmModal";
import CommentList from "@components/CommentList";
import {
  fetchProductDetail,
  addFavorite,
  removeFavorite,
  deleteProduct,
} from "@api/productApi";

import defaultImage from "@images/pandaLogo.png";

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인이 필요합니다.");
        return router.push("/login");
      }

      if (isFavorite) {
        await removeFavorite(productId, token);
        setFavoriteCount(favoriteCount - 1);
      } else {
        await addFavorite(productId, token);
        setFavoriteCount(favoriteCount + 1);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("좋아요 업데이트 중 문제가 발생했습니다.", error);
    }
  };

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인이 필요합니다.");
        return router.push("/login");
      }

      const productData = await fetchProductDetail(productId, token);

      setProduct(productData);
      setIsFavorite(productData.isFavorite);
      setFavoriteCount(productData.favoriteCount);
    } catch (error) {
      setError("상품 정보를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/items/${productId}/edit`);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await deleteProduct(productId, token);
      router.push("/items");
    } catch (error) {
      alert("상품 삭제 중 문제가 발생했습니다.");
    }
  };

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
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
          <Image
            src={product.images.length > 0 ? product.images[0] : defaultImage}
            alt={product.name}
            width={400}
            height={400}
            priority
          />
          <h1>{product.name}</h1>
          <p>가격: {product.price}원</p>
          <p>설명: {product.description}</p>
          <p>작성자: {product.ownerNickname}</p>

          <button onClick={toggleFavorite}>
            {isFavorite ? "❤️" : "♡"}&nbsp;
            {favoriteCount}
          </button>

          {user?.id === product.ownerId && (
            <KebabDropdown onEdit={handleEdit} onDelete={openDeleteModal} />
          )}

          <CommentList productId={productId} />
        </>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
      <button onClick={() => router.push("/items")}>목록으로 돌아가기</button>
    </div>
  );
};

export default ProductDetail;
