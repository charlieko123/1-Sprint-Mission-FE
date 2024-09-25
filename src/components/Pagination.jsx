import React from "react";
import styles from "@styles/Pagination.module.css";

function Pagination({ currentPage, totalPage, onChangePage }) {
  const handlePrevPage = () => {
    if (currentPage > 1) onChangePage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPage) onChangePage(currentPage + 1);
  };

  const makeNumberButton = () => {
    const pageNumbers = [];
    let startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
    let endPage = startPage + 4 > totalPage ? totalPage : startPage + 4;

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          className={`${styles.pageButton} ${
            currentPage === i ? styles.on : ""
          } text-lg semibold`}
          key={i}
          onClick={() => onChangePage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className={styles.footer}>
      <button
        className={`${styles.pageButton} ${
          currentPage === 1 ? styles.disabled : ""
        } text-lg semibold`}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {makeNumberButton()}
      <button
        className={`${styles.pageButton} ${
          currentPage === totalPage ? styles.disabled : ""
        } text-lg semibold`}
        onClick={handleNextPage}
        disabled={currentPage === totalPage}
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;
