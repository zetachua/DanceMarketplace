import logo from './logo.svg';
import './App.css';
import GradientBackground from './Components/GradientBackground/GradientBackground';
import PortfolioCard from './Components/PortfolioCard/PortfolioCard';
import GrainyBackground from './Components/GrainyBackground/GrainyBackground';
function App() {
  return (
    <div className='App-container'>
      <div style={{ display:'flex', gap:'5rem'}}>
        <PortfolioCard backgroundColor='#124AF7' gradientBackground='#124AF7' color1='#7D9AF3' color2='#B3C3F5' color3='#F17391' baseFrequency='0.4'></PortfolioCard>
        <PortfolioCard backgroundColor='#28302A' color1='#AB3F07' color2='#E89E7E' color3='#AB3F07'></PortfolioCard>
        <PortfolioCard backgroundColor='#04104C' color1='#A4D7AD' color2='#C1E1C6' color3='#73DB86'></PortfolioCard>
      </div>
      {/* <PortfolioCard backgroundColor='var(--bg)' color1='var(--red)' color2='var(--yellow)' color3='var(--green)'></PortfolioCard> */}
      {/* <PortfolioCard></PortfolioCard>
        <GradientBackground display='none' width='100%' height='100vh'></GradientBackground> */}
    </div>
  );
}
export default App;