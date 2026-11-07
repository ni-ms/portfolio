import { portfolioData } from './content/portfolio';

export default function App() {
  return (
    <div className="portfolio-app">
      <header>
        <h1>{portfolioData.owner.name}</h1>
      </header>
    </div>
  );
}
