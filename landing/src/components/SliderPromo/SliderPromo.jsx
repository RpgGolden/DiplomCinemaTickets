import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import styles from './SliderPromo.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { activePoint } from '../../utils/testData';
import { useEffect } from 'react';
import { getAllPosters } from '../../API/apiRequest';
import { useState } from 'react';

function SliderPromo() {
    const [dataSlider, setDataSlider] = useState([]);
    const swiperRef = useRef(null);
    useEffect(()=>{
        getAllPosters().then((res) => {
            setDataSlider(res.data)
            console.log(res.data)
        })
    },[])
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
                {dataSlider.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className={styles.slide}>
                            {/* <p className={styles.date}>{item.date}</p> */}
                            <img src={item.imageUrl} alt={`Слайд ${index + 1}`} className={styles.image} />
                            {/* <p className={styles.text}>{item.textSlide}</p> */}
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