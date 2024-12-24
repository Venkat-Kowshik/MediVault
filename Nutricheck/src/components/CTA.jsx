import styles from "../style";
import Button1 from "./Button1";

const CTA = () => (
  <section id="clients" className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-dimwhite rounded-[20px] box-shadow`}>
    <div className="flex-1 flex flex-col">
      <h2 className={styles.heading2}>TeleHealth</h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
      A global health platform connecting patients and doctors for instant, reliable, and accessible healthcare services, bridging geographical gaps and ensuring timely medical assistance.      

      </p>
      <p>Under Development!!</p>
    </div>

    <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
      <Button1 />
    </div>
  </section>
);

export default CTA;
