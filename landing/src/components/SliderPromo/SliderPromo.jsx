import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import styles from './SliderPromo.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { activePoint } from '../../utils/testData';

function SliderPromo() {
   
    const swiperRef = useRef(null);

    return ( 
        <div className={styles.sliderPromoContainer}>
            <div className={styles.arrow} onClick={() => swiperRef.current?.slidePrev()}>
                <ChevronLeft />
            </div>
            <Swiper
                className={styles.sliderPromo}
                slidesPerView={1}
                spaceBetween={30}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className}" style="background-color: var(--accent-color);"></span>`;
                    },
                }}
                modules={[Pagination]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
                {activePoint.sliderData.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className={styles.slide}>
                            <p className={styles.date}>{item.date}</p>
                            <img src={item.image} alt={`Слайд ${index + 1}`} className={styles.image} />
                            <p className={styles.text}>{item.textSlide}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className={styles.arrow} onClick={() => swiperRef.current?.slideNext()}>
                <ChevronRight/>
            </div>
        </div>
    );
}

export default SliderPromo;