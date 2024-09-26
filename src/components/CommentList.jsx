import { useState, useEffect } from "react";
import Comment from "./Comment";
import axios from "@/lib/axios";

const CommentList = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/products/${productId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("댓글을 불러오는 중 문제가 발생했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/products/${productId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("댓글 추가 중 문제가 발생했습니다:", error);
    }
  };

  const handleEditComment = async (commentId, updatedContent) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/comments/${commentId}`,
        { content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch (error) {
      console.error("댓글 수정 중 문제가 발생했습니다:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (error) {
      console.error("댓글 삭제 중 문제가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  if (isLoading) return <p>로딩중...</p>;

  return (
    <div>
      <h2>문의하기</h2>
      <div>
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onDelete={() => handleDeleteComment(comment.id)}
            onEdit={handleEditComment}
          />
        ))}
      </div>

      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력해주세요."
        />
        <button onClick={handleAddComment}>등록</button>
      </div>
    </div>
  );
};

export default CommentList;
