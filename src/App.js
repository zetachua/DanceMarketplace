import logo from './logo.svg';
import './App.css';
import GradientBackground from './Components/GradientBackground/GradientBackground';
import PortfolioCard from './Components/PortfolioCard/PortfolioCard';
function App() {
  return (
    <div className='App-container'>
      <PortfolioCard></PortfolioCard>
      <GradientBackground display='none' width='100%' height='100vh'></GradientBackground>
    </div>
     

  );
}

export default App;
