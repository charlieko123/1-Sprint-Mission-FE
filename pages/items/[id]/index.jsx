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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import defaultImage from "@images/pandaLogo.png";

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    data: product,
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

  const toggleFavoriteMutation = useMutation(
    async () => {
      if (product.isFavorite) {
        await removeFavorite(productId, token);
      } else {
        await addFavorite(productId, token);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["product", productId]); // 성공하면 캐시 무효화
      },
    }
  );

  const deleteProductMutation = useMutation(
    async () => {
      return deleteProduct(productId, token);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products"); // 성공 시 상품 목록을 다시 불러옴
        router.push("/items");
      },
    }
  );

  const toggleFavorite = () => {
    toggleFavoriteMutation.mutate();
  };

  const handleDelete = () => {
    deleteProductMutation.mutate();
  };

  const handleEdit = () => {
    router.push(`/items/${productId}/edit`);
  };

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <p>로딩중...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      {product && (
        <>
          <Image
            // src={product.images.length > 0 ? product.images[0] : defaultImage}
            src={defaultImage}
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
