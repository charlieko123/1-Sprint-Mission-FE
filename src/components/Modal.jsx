import React from "react";
import styles from "@styles/Modal.module.css";

const Modal = ({ message, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <button onClick={onClose} className={styles.button}>
          확인
        </button>
      </div>
    </div>
  );
};

export default Modal;
