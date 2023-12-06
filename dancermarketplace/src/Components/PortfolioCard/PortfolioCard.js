import React from "react"
import { PortfolioCardContainer,PortfolioCardLayout } from "./PortfolioCard.style"
import GradientBackground from "../GradientBackground/GradientBackground"
import { PortfolioCardBox } from "./PortfolioCard.style"
export default function PortfolioCard(){
    return(
        <PortfolioCardContainer>
            <PortfolioCardLayout>
                <img src={"/portfoliocardDP.png"}  alt="temporary dp photo" style={{ borderRadius:'10px',width: '100%',margin:'auto'}} />
                <PortfolioCardBox>
                    <GradientBackground name='Hello' opacity='0.7' borderRadius= '10px' width='130px' height='60px' ></GradientBackground>
                    <GradientBackground opacity='0.7' borderRadius= '10px' width='130px' height='60px' ></GradientBackground>
                    <GradientBackground opacity='0.7' borderRadius= '10px' width='130px' height='60px' ></GradientBackground>
                    <GradientBackground opacity='0.7' borderRadius= '10px' width='130px' height='60px' ></GradientBackground>
                </PortfolioCardBox>
            </PortfolioCardLayout>
        </PortfolioCardContainer>
    )
}