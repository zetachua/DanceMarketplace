import React, { useState } from "react"
import GradientBackground from "../GradientBackground/GradientBackground"
import ScreenRecorderWithGIFConversion from "../ScreenrecordToGif/screenRecordToGif"
import styled from 'styled-components';
import GrainyBackground from "../GrainyBackground/GrainyBackground"

export default function PortfolioCard(props){
    const {backgroundColor,gradientBackground,baseFrequency,color1,color2,color3} = props;
    const image=process.env.PUBLIC_URL + "/portfoliocardDP-removeBg.png";
    const PortfolioCardContainer = styled.div`
        display:flex;
        justify-content:center;
        align-items:center;
        height:90vh;
        width:29%;
        border-radius:10px;

    `;
    const PortfolioImage =styled.img`
        display:flex;
        justify-content:center; 
        position: absolute;
        border-radius:10px;
        width:30%;
    `;

    const PortfolioTitle =styled.div`
        position:absolute;
        z-index:1;
        color:white;
        font-size:48px;
    `;

    return(
        <PortfolioCardContainer> 
            <PortfolioTitle><b>Working Zeta</b></PortfolioTitle>
            {/* <GradientBackground name='Hello' opacity='0.7' borderRadius= '10px' width='130px' height='60px' ></GradientBackground> */}
            <GrainyBackground backgroundColor={backgroundColor} gradientBackground={gradientBackground} baseFrequency={baseFrequency} color1={color1} color2={color2} color3={color3}/>
            {/* <PortfolioImage src={image} alt="temporary dp photo" /> */}
        </PortfolioCardContainer>
    )
}