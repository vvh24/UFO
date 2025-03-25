import React, { useState, useEffect } from 'react';
import MapVisualization from './components/MapVisualization';
import TimelineChart from './components/TimelineChart';
import StateRankingChart from './components/StateRankingChart';
import NuclearProximityAnalysis from './components/NuclearProximityAnalysis';
import { processUFOData, processMilitaryBaseData, processNuclearReactorData } from './utils/dataProcessing';
import './styles/App.css';

function App() {
  const [ufoData, setUfoData] = useState([]);
  const [militaryBaseData, setMilitaryBaseData] = useState([]);
  const [nuclearReactorData, setNuclearReactorData] = useState([]);
  const [usMapData, setUsMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [yearRange, setYearRange] = useState([1950, 2023]); // Default range
  const [selectedStates, setSelectedStates] = useState([]);
  const [showMilitaryBases, setShowMilitaryBases] = useState(true);
  const [showNuclearReactors, setShowNuclearReactors] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Starting to fetch data...");
        
        // Load UFO sightings data
        console.log("Fetching UFO data...");
        const ufoResponse = await fetch(`${process.env.PUBLIC_URL}/data/ufo-sightings.csv`);
        if (!ufoResponse.ok) {
          throw new Error(`Failed to load UFO data: ${ufoResponse.status} ${ufoResponse.statusText}`);
        }
        const ufoText = await ufoResponse.text();
        console.log("UFO data sample:", ufoText.substring(0, 200));
        const processedUFOData = processUFOData(ufoText);
        setUfoData(processedUFOData);
        
        // Load military bases data
        console.log("Fetching military bases data...");
        const basesResponse = await fetch(`${process.env.PUBLIC_URL}/data/military-bases-expanded.csv`);
        if (!basesResponse.ok) {
          throw new Error(`Failed to load military bases data: ${basesResponse.status} ${basesResponse.statusText}`);
        }
        const basesText = await basesResponse.text();
        console.log("Military bases data sample:", basesText.substring(0, 200));
        const processedBaseData = processMilitaryBaseData(basesText);
        setMilitaryBaseData(processedBaseData);
        
        // Load nuclear reactor data
        console.log("Fetching nuclear reactor data...");
        const reactorResponse = await fetch(`${process.env.PUBLIC_URL}/data/nuclear-reactors.csv`);
        if (!reactorResponse.ok) {
          throw new Error(`Failed to load nuclear reactor data: ${reactorResponse.status} ${reactorResponse.statusText}`);
        }
        const reactorText = await reactorResponse.text();
        console.log("Nuclear reactor data sample:", reactorText.substring(0, 200));
        const processedReactorData = processNuclearReactorData(reactorText);
        setNuclearReactorData(processedReactorData);
        
        // Load US map data
        console.log("Fetching US map data...");
        const mapResponse = await fetch(`${process.env.PUBLIC_URL}/data/us-states.json`);
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
  
  const toggleNuclearReactors = () => {
    setShowNuclearReactors(!showNuclearReactors);
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
        <h1>UFO Sightings, Military Bases & Nuclear Facilities</h1>
        <p>Exploring the relationship between reported UFO sightings and critical infrastructure</p>
      </header>
      
      <div className="controls">
        <div className="control-group">
          <label>
            <input 
              type="checkbox"
              checked={showMilitaryBases}
              onChange={toggleMilitaryBases}
            />
            Show Military Bases
          </label>
        </div>
        
        <div className="control-group">
          <label>
            <input 
              type="checkbox"
              checked={showNuclearReactors}
              onChange={toggleNuclearReactors}
            />
            Show Nuclear Reactors
          </label>
        </div>
      </div>
      
      <main>
        <section className="main-visualization">
          <MapVisualization 
            ufoData={filteredUFOData}
            militaryBaseData={showMilitaryBases ? militaryBaseData : []}
            nuclearReactorData={showNuclearReactors ? nuclearReactorData : []}
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
          
          <div className="chart nuclear-proximity">
            <NuclearProximityAnalysis 
              ufoData={ufoData}
              nuclearReactorData={nuclearReactorData}
            />
          </div>
        </section>
      </main>
      
      <footer>
        <p>Data sources: NUFORC UFO Sightings Database, Department of Defense Military Installations, US Nuclear Regulatory Commission</p>
      </footer>
    </div>
  );
}

export default App;