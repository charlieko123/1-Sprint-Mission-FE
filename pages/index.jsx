import BestProductsMain from "@/src/components/BestProductsMain";
import styles from "@styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <BestProductsMain />
      <h1 className={`${styles.homeTitle} text-xl bold`}>Home Page 입니다</h1>
    </div>
  );
}
