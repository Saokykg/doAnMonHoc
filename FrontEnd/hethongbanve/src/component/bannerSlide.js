import React from "react";
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import banner1 from '../static/img/banner/banner1.jpg';
import banner2 from '../static/img/banner/banner2.jpg';
import banner3 from '../static/img/banner/banner3.jpg';

export default function BannerSilde(){
    return(
        <>
        <AutoplaySlider
        play={true}
        cancelOnInteraction={false}
        interval={6000}
        mobileTouch={true}
        >
            <div data-src={"https://pacificcross.com.vn/wp-content/uploads/2020/11/b2ap3_large_du-lich-the-gioi.jpg"} />
            <div data-src={"https://cdn.tgdd.vn/Files/2021/05/21/1353493/top-nhung-dia-diem-check-in-noi-tieng-khi-di-du-li-2.jpg"} />
            <div data-src={"https://file3.qdnd.vn/data/images/0/2021/10/06/vuongthuy/15092021vthuy556.jpg?dpi=150&quality=100&w=870"} />
            </AutoplaySlider>
        </>
    )
}

const AutoplaySlider = withAutoplay(AwesomeSlider);
 