import BestProductsMain from "@/src/components/BestProductsMain";
import styles from "@styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <BestProductsMain />
    </div>
  );
}
