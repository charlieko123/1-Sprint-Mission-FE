import { useRouter } from "next/router";
import { useState, useContext } from "react";
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
import styles from "@styles/ProductDetail.module.css";

import defaultImage from "@images/pandaLogo.png";

const ProductDetail = () => {
  const router = useRouter();
  const { id: productId } = router.query;
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
    <div className={styles.productDetailContainer}>
      {product && (
        <>
          <Image
            className={styles.productImage}
            src={product.images.length > 0 ? product.images[0] : defaultImage}
            alt={product.name}
            width={400}
            height={400}
            priority
          />
          <div className={styles.productInfo}>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productPrice}>가격: {product.price}원</p>
            <p className={styles.productDescription}>{product.description}</p>
            <p className={styles.productOwner}>
              작성자: {product.ownerNickname}
            </p>

            <button className={styles.favoriteButton} onClick={toggleFavorite}>
              {product.isFavorite ? "❤️" : "♡"}&nbsp;
              {product.favoriteCount}
            </button>

            {user?.id === product.ownerId && (
              <div className={styles.kebabDropdown}>
                <KebabDropdown onEdit={handleEdit} onDelete={openDeleteModal} />
              </div>
            )}
          </div>
          <div className={styles.commentsSection}>
            <CommentList productId={productId} />
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        className={styles.confirmModal}
      />
      <button
        className={styles.backButton}
        onClick={() => router.push("/items")}
      >
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default ProductDetail;
