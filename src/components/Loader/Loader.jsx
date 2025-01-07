import styles from "./style.module.css";

export default () => {
  return (
    <div className={styles.content}>
      {[...Array(2)].map((_, i) => (
        <div className={styles.bars} key={i}>
          {[...Array(7)].map((_, b) => (
            <div className={styles.bar} key={b}></div>
          ))}
        </div>
      ))}
    </div>
  );
};
