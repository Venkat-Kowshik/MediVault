import {medivault} from '../assets';

import styles, { layout } from "../style";
import Button from "./Button";

const WeatherBite = () => (
  <section id="WeatherBite" className={layout.section1}>
    <div className={layout.sectionImg1}>
      <img src={medivault} alt="Weather Bite" className="w-[100%] h-[100%]" />
    </div>

    <div className={layout.sectionInfo1} >
      <h2 className={styles.heading2}>
        Medivault <br className="sm:block hidden" />
      </h2> 
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
      Safeguarding Health, Securing Lives
      </p>

      <a href='http://localhost:5173'><Button styles={`mt-10`} name={`demon`}/></a>
    </div>
  </section>
);

export default WeatherBite;