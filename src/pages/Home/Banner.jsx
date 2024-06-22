import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import banner1  from "../../assets/banner1.png"
import banner2  from "../../assets/banner2.png"
import banner3  from "../../assets/banner3.jpg"

// import required modules
import { Autoplay, Pagination } from "swiper/modules";

const Banner = () => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
       
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide><img src={banner3} alt="" className="h-[600px] w-full mx-auto" /></SwiperSlide>
        <SwiperSlide><img src={banner2} alt="" className="h-[600px] w-full mx-auto"/></SwiperSlide>
        <SwiperSlide><img src={banner1} alt="" className="h-[600px] w-full mx-auto"/></SwiperSlide>
      </Swiper>
    </>
  );
};

export default Banner;
