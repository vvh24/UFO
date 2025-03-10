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
  const [yearRange, setYearRange] = useState([1950, 2023]); // Default range
  const [selectedStates, setSelectedStates] = useState([]);
  const [showMilitaryBases, setShowMilitaryBases] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Starting to fetch data...");
        
        // Load UFO sightings data
        console.log("Fetching UFO data...");
        const ufoResponse = await fetch('/data/ufo-sightings.csv');
        if (!ufoResponse.ok) {
          throw new Error(`Failed to load UFO data: ${ufoResponse.status} ${ufoResponse.statusText}`);
        }
        const ufoText = await ufoResponse.text();
        console.log("UFO data sample:", ufoText.substring(0, 200));
        const processedUFOData = processUFOData(ufoText);
        setUfoData(processedUFOData);
        
        // Load military bases data - using expanded dataset
        console.log("Fetching expanded military bases data...");
        const basesResponse = await fetch('/data/military-bases-expanded.csv');
        if (!basesResponse.ok) {
          throw new Error(`Failed to load military bases data: ${basesResponse.status} ${basesResponse.statusText}`);
        }
        const basesText = await basesResponse.text();
        console.log("Military bases data sample:", basesText.substring(0, 200));
        const processedBaseData = processMilitaryBaseData(basesText);
        setMilitaryBaseData(processedBaseData);
        
        // Load US map data
        console.log("Fetching US map data...");
        const mapResponse = await fetch('/data/us-states.json');
        if (!mapResponse.ok) {
          throw new Error(`Failed to load US map data: ${mapResponse.status} ${mapResponse.statusText}`);
        }
        const mapData = await mapResponse.json();
        setUsMapData(mapData);
        
        console.log("All data loaded successfully!");
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError('Failed to load data: ' + err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleYearRangeChange = (range) => {
    setYearRange(range);
  };
  
  const handleStateSelection = (states) => {
    setSelectedStates(states);
  };
  
  const toggleMilitaryBases = () => {
    setShowMilitaryBases(!showMilitaryBases);
  };
  
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