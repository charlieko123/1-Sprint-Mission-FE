import axios from "@/lib/axios";

// 상품 상세 조회
export const fetchProductDetail = async (productId, token) => {
  const response = await axios.get(`/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 상품 좋아요
export const addFavorite = async (productId, token) => {
  await axios.post(`/products/${productId}/favorite`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 상품 좋아요 취소
export const removeFavorite = async (productId, token) => {
  await axios.delete(`/products/${productId}/favorite`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 상품 삭제
export const deleteProduct = async (productId, token) => {
  await axios.delete(`/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
