import styles from "@styles/ConfirmModal.module.css";
import Image from "next/image";
import checkIcon from "@images/ic_check.svg";
import { useRef, useEffect } from "react";

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onCancel();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <Image src={checkIcon} alt="check icon" width={32} height={32} />
        <p className={styles.modalMessage}>정말로 상품을 삭제하시겠어요?</p>
        <div className={styles.modalActions}>
          <button onClick={onCancel} className={styles.button}>
            취소
          </button>
          <button onClick={onConfirm} className={styles.button}>
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
