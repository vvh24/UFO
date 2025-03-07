import React, { useState, useEffect } from 'react';
import MapVisualization from './components/MapVisualization';
import TimelineChart from './components/TimelineChart';
import StateRankingChart from './components/StateRankingChart';
import { processUFOData, processMilitaryBaseData } from './utils/dataProcessing';
import './styles/App.css';

function App() {
  const [ufoData, setUfoData] = useState([]);
  const [militaryBaseData, setMilitaryBaseData] = useState([]);
  const [usMapData, setUsMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [yearRange, setYearRange] = useState([1950, 2023]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [showMilitaryBases, setShowMilitaryBases] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load UFO sightings data
        const ufoResponse = await fetch('/data/ufo-sightings.csv');
        const ufoText = await ufoResponse.text();
        const processedUFOData = processUFOData(ufoText);
        setUfoData(processedUFOData);
        
        // Load military bases data
        const basesResponse = await fetch('/data/military-bases.csv');
        const basesText = await basesResponse.text();
        const processedBaseData = processMilitaryBaseData(basesText);
        setMilitaryBaseData(processedBaseData);
        
        // Load US map data
        const mapResponse = await fetch('/data/us-states.json');
        const mapData = await mapResponse.json();
        setUsMapData(mapData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data: ' + err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter data based on selected filters
  const filteredUFOData = ufoData.filter(sighting => {
    const yearMatch = sighting.year >= yearRange[0] && sighting.year <= yearRange[1];
    const stateMatch = selectedStates.length === 0 || selectedStates.includes(sighting.state);
    return yearMatch && stateMatch;
  });
  
  if (loading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="app">
      <header>
        <h1>UFO Sightings & Military Bases Visualization</h1>
        <p>Exploring the relationship between reported UFO sightings and US military installations</p>
      </header>
      
      <main>
        <section className="main-visualization">
          <MapVisualization 
            ufoData={filteredUFOData}
            militaryBaseData={showMilitaryBases ? militaryBaseData : []}
            usMapData={usMapData}
          />
        </section>
        
        <section className="supporting-charts">
          <div className="chart timeline">
            <TimelineChart ufoData={ufoData} yearRange={yearRange} />
          </div>
          
          <div className="chart state-ranking">
            <StateRankingChart ufoData={ufoData} />
          </div>
        </section>
      </main>
      
      <footer>
        <p>Data sources: NUFORC UFO Sightings Database, Department of Defense Military Installations</p>
      </footer>
    </div>
  );
}

export default App;