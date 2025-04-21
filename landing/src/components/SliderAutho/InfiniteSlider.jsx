import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import styles from './InfiniteSlider.module.scss';

const InfiniteSlider = () => {
    const images = [
        '/img/logoComp/1logo.png',
        '/img/logoComp/2logo.png',
        '/img/logoComp/4logo.png',
        '/img/logoComp/8logo.png',
        '/img/logoComp/9logo.png',
        '/img/logoComp/10logo.png',
        '/img/logoComp/11logo.png',
    ]
  return (
    <div className={styles.infiniteSlider}>
      <Swiper
        slidesPerView={4}
        spaceBetween={40}
        loop={true}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
      >
        {images.map((imgSrc, index) => (
          <SwiperSlide key={index}>
            <img src={imgSrc} alt={`slide-${index}`} className={styles.slideImage} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default InfiniteSlider;
