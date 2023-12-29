// src/components/Hero.js
import React from 'react';
import BlobComponent from './BlobComponent';
import PortfolioCard from '../PortfolioCard/PortfolioCard';
import { SvgPortfolio,GrainyBackgroundContainer} from './GrainyBackground.styles';
import { backgroundRemoval } from '@cloudinary/url-gen/actions/effect';
import GradientBackground from '../GradientBackground/GradientBackground';
const GrainyBackground = (props) => {
  const {baseFrequency,gradientBackground,backgroundColor,color1,color2,color3}=props;
  return (
    <GrainyBackgroundContainer> 
        <div class="blob-cont" >
            <BlobComponent
              color={color1}
              position={{ top: '200px', left: '100px', height: '350px', width: '200px' }}
              animation="eastNorthWest 8s infinite ease"
            />
              <BlobComponent
              color={color2}
              position={{ top: '80px', right: '-20px', height: '300px', width: '200px' }}
              animation="eastNorth 8s infinite ease"
            />
              <BlobComponent
              color={color3}
              position={{ top: '300px', right: '0', height: '400px', width: '200px' }}
              animation="northWest 8s infinite ease"
            />
        </div>
        <svg style={{
                position:'absolute',
                width:"100%",
                height:'90vh',
                zIndex:'-4',
                borderRadius:'10px'
                }} 
                fill={`url(#gradient-${backgroundColor})`}
                xmlns="http://www.w3.org/2000/svg">
            <filter id='noiseFilter'>
            <feTurbulence type='fractalNoise'baseFrequency={baseFrequency} stitchTiles='stitch' xresult="colorNoise" />
                <feColorMatrix in="colorNoise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
                <feComposite operator="in" in2="SourceGraphic" result="monoNoise"/>
                <feBlend in="SourceGraphic" in2="monoNoise" mode="hard-light" />
            </filter>
            <linearGradient id={`gradient-${backgroundColor}`} gradientTransform="rotate(90)">
              <stop stop-color={backgroundColor} offset="10%" />
              {gradientBackground && <stop stop-color={gradientBackground} offset="100%" />}
                {/* <stop stop-color={backgroundColor} offset="100%" /> */}
            </linearGradient>

            <rect height="100%" width="100%" filter="url(#noiseFilter) "/>
          </svg>    
        {/* <SvgPortfolio>
          <filter id='noiseFilter'>
            <feTurbulence type='fractalNoise'baseFrequency={baseFrequency} stitchTiles='stitch' xresult="colorNoise" />
              <feColorMatrix in="colorNoise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
              <feComposite operator="in" in2="SourceGraphic" result="monoNoise"/>
              <feBlend in="SourceGraphic" in2="monoNoise" mode="hard-light" />
            </filter>
            <rect width="100%" height="100%" style={{backgroundColor:'#1A211E'}}filter='url(#noiseFilter)'></rect>
        </SvgPortfolio> */}

      {/* <svg class="gr1" xmlns="http://www.w3.org/2000/svg" width="904" height="576" viewBox="0 0 904 576" fill="url(#gradient)">

      <filter id="grain">
        <feTurbulence type='fractalNoise'baseFrequency='0.6' stitchTiles='stitch' xresult="colorNoise" />
        <feColorMatrix in="colorNoise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
        <feComposite operator="in" in2="SourceGraphic" result="monoNoise"/>
        <feBlend in="SourceGraphic" in2="monoNoise" mode="hard-light" />

       </filter>

    <filter id="innershadow">
      <feFlood flood-color="rgb(255,255,255,0.2)"/>

      <feComposite operator="out" in2="SourceGraphic" />

      <feMorphology operator="dilate" radius="0"/>
      <feGaussianBlur stdDeviation="15" />
      <feOffset dx="-7" dy="-45"/>

      <feComposite operator="atop" in2="SourceGraphic"/>
    </filter>

    <linearGradient id="gradient">
      <stop stop-color="var(--orange)" offset="30%" />
      <stop stop-color="var(--blue)" offset="100%" />
    </linearGradient>

  <path filter="url(#grain) url(#innershadow)" d="M422.387 198.227L422.391 198.219L422.396 198.211C502.319 60.8445 622.539 0.0311147 722.711 0.502722C772.8 0.738534 817.863 16.2941 850.397 45.241C882.924 74.1814 902.964 116.538 902.964 170.46C902.964 386.353 722.037 540.046 503.397 569.464C391.377 584.537 274.916 566.55 182.513 516.836C90.1201 467.127 21.7931 385.709 5.95884 273.89C-0.102654 231.085 -0.934731 202.296 2.56416 184.102C4.31299 175.009 7.13492 168.612 10.881 164.434C14.6125 160.271 19.2937 158.273 24.8606 158.03C30.4474 157.786 36.934 159.312 44.2331 162.232C51.5277 165.151 59.5994 169.448 68.3466 174.712C81.0437 182.352 95.1262 192.005 110.285 202.396C116.019 206.327 121.908 210.364 127.934 214.437C171.8 244.087 222.893 275.643 274.278 281.98C299.987 285.15 325.778 282.01 350.771 269.162C375.759 256.315 399.914 233.783 422.387 198.227Z"/>
    <radialGradient id="G1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%"   style={{stopColor:'rgb(119,183,167,0.7)', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'rgb(119,183,167)', stopOpacity:0}} />
      </radialGradient>
     <ellipse cx="350" cy="400" rx="300" ry="200" clip-path="url(#C)" fill="url(#G1)" />
  </svg> */}
  
   {/* <svg class="gr2" xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" fill="url(#gradient2)">
  
    <filter id="grain">
      <feTurbulence type='fractalNoise'baseFrequency='0.6' stitchTiles='stitch' xresult="colorNoise" />
      <feColorMatrix in="colorNoise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
      <feComposite operator="in" in2="SourceGraphic" result="monoNoise"/>
      <feBlend in="SourceGraphic" in2="monoNoise" mode="hard-light" />
     
    </filter>
  
    <filter id="innershadow2">
      <feFlood flood-color="rgb(255,255,255,0.1)"/>

      <feComposite operator="out" in2="SourceGraphic" />

      <feMorphology operator="dilate" radius="1"/>
      <feGaussianBlur stdDeviation="15" />
      <feOffset dx="-20" dy="0"/>

      <feComposite operator="atop" in2="SourceGraphic"/>
    </filter>

    <linearGradient id="gradient2" gradientTransform="rotate(0)">
      <stop stop-color="#CF9862" offset="30%" />
      <stop stop-color="#436354" offset="100%" />
    </linearGradient>

    <rect width="100%" height="100%" filter="url(#grain) url(#innershadow2)"/>
  </svg> */}
      
    </GrainyBackgroundContainer>
  );
};

export default GrainyBackground;
