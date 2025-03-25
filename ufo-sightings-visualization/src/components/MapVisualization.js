import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import '../styles/components/MapVisualization.css';

const MapVisualization = ({ ufoData, militaryBaseData, nuclearReactorData, usMapData }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = svgRef.current.parentElement.clientWidth;
      setDimensions({
        width: containerWidth,
        height: containerWidth * 0.6, // Maintain aspect ratio
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Draw map when data or dimensions change
  useEffect(() => {
    if (!usMapData || !dimensions.width || !dimensions.height) return;
    
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    
    // Clear previous rendering
    svg.selectAll('*').remove();
    
    svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('viewBox', [0, 0, dimensions.width, dimensions.height])
      .attr('style', 'max-width: 100%; height: auto;');
    
    // Create projection
    const projection = d3.geoAlbersUsa()
      .fitSize([dimensions.width, dimensions.height], topojson.feature(usMapData, usMapData.objects.states));
    
    // Create path generator
    const path = d3.geoPath().projection(projection);
    
    // Map of state names to abbreviations
    const stateNameToAbbr = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
      'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
      'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
      'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
      'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
      'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
      'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
      'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
      'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
      'District of Columbia': 'DC'
    };
    
    // Group data by state to count sightings per state
    const sightingsByState = d3.rollup(
      ufoData,
      v => v.length,
      d => d.state ? d.state.toUpperCase() : "Unknown"
    );
    
    // Log state codes for debugging
    console.log("State codes in UFO data:", Array.from(sightingsByState.keys()));
    console.log("First few UFO state values:", ufoData.slice(0, 5).map(d => d.state));
    
    // Create color scale for states
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(Array.from(sightingsByState.values())) || 1]);
    
    // Draw states with color coding
    const states = svg.append('g')
      .selectAll('path')
      .data(topojson.feature(usMapData, usMapData.objects.states).features)
      .join('path')
      .attr('fill', d => {
        // Try different state code formats to match with UFO data
        const stateName = d.properties.name;
        const stateAbbr = stateNameToAbbr[stateName];
        
        // Try to find sightings count using state abbreviation
        let count = 0;
        if (stateAbbr && sightingsByState.has(stateAbbr)) {
          count = sightingsByState.get(stateAbbr);
        } else if (stateAbbr && sightingsByState.has(stateAbbr.toLowerCase())) {
          count = sightingsByState.get(stateAbbr.toLowerCase());
        }
        
        // Return color based on count
        return colorScale(count);
      })
      .attr('stroke', '#999')
      .attr('stroke-width', 0.5)
      .attr('d', path)
      .attr('class', 'state')
      .on('mouseover', function(event, d) {
        const stateName = d.properties.name;
        const stateAbbr = stateNameToAbbr[stateName];
        
        // Try to find the correct count by trying different state code formats
        let count = 0;
        if (stateAbbr && sightingsByState.has(stateAbbr)) {
          count = sightingsByState.get(stateAbbr);
        } else if (stateAbbr && sightingsByState.has(stateAbbr.toLowerCase())) {
          count = sightingsByState.get(stateAbbr.toLowerCase());
        } else if (stateName && sightingsByState.has(stateName)) {
          count = sightingsByState.get(stateName);
        }
        
        d3.select(this)
          .attr('stroke', '#333')
          .attr('stroke-width', 1.5);
          
        tooltip
          .style('opacity', 1)
          .html(`<strong>${stateName}</strong><br>${count.toLocaleString()} UFO sightings`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke', '#999')
          .attr('stroke-width', 0.5);
          
        tooltip.style('opacity', 0);
      });
    
    // Add UFO sightings
    svg.append('g')
      .selectAll('circle')
      .data(ufoData)
      .join('circle')
      .attr('cx', d => {
        const coords = projection([d.longitude, d.latitude]);
        if (!coords) return null; // Skip this point if projection returns null
        return coords[0];
      })
      .attr('cy', d => {
        const coords = projection([d.longitude, d.latitude]);
        if (!coords) return null; // Skip this point if projection returns null
        return coords[1];
      })
      .attr('r', 3)
      .attr('fill', 'rgba(255, 215, 0, 0.6)')  // Gold color with transparency
      .attr('stroke', 'rgba(255, 215, 0, 0.9)')
      .attr('stroke-width', 1)
      .attr('class', 'ufo-sighting')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', 6)
          .attr('fill', 'rgba(255, 215, 0, 0.9)');
        
        tooltip
          .style('opacity', 1)
          .html(`
            <strong>UFO Sighting</strong><br>
            Date: ${d.date || d.datetime || 'Unknown'}<br>
            Location: ${d.city || 'Unknown'}, ${d.state || 'Unknown'}<br>
            Shape: ${d.shape || 'Unknown'}<br>
            Duration: ${d.duration || 'N/A'}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('r', 3)
          .attr('fill', 'rgba(255, 215, 0, 0.6)');
          
        tooltip.style('opacity', 0);
      });
    
    // Add military bases
    if (militaryBaseData.length > 0) {
      svg.append('g')
        .selectAll('path')
        .data(militaryBaseData)
        .join('path')
        .attr('transform', d => {
          const coords = projection([d.longitude, d.latitude]);
          if (!coords) return null; // Skip this point if projection returns null
          return `translate(${coords[0]}, ${coords[1]})`;
        })
        .attr('d', 'M-5,-5 L0,-10 L5,-5 L5,5 L-5,5 Z') // Pentagon shape for military bases
        .attr('fill', 'rgba(220, 20, 60, 0.7)') // Crimson color with transparency
        .attr('stroke', 'rgba(220, 20, 60, 0.9)')
        .attr('stroke-width', 1)
        .attr('class', 'military-base')
        .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('fill', 'rgba(220, 20, 60, 0.9)');
            
          tooltip
            .style('opacity', 1)
            .html(`
              <strong>Military Base</strong><br>
              Name: ${d.name || 'Unknown'}<br>
              Type: ${d.type || 'N/A'}<br>
              Branch: ${d.branch || 'N/A'}
            `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('fill', 'rgba(220, 20, 60, 0.7)');
            
          tooltip.style('opacity', 0);
        });
    }
    
    // Add nuclear reactors
    if (nuclearReactorData.length > 0) {
        svg.append('g')
        .selectAll('circle')
        .data(nuclearReactorData)
        .join('circle')
        .attr('cx', d => {
            const coords = projection([d.longitude, d.latitude]);
            if (!coords) return null; // Skip this point if projection returns null
            return coords[0];
        })
        .attr('cy', d => {
            const coords = projection([d.longitude, d.latitude]);
            if (!coords) return null; // Skip this point if projection returns null
            return coords[1];
        })
        .attr('r', 6)
        .attr('fill', 'rgba(50, 205, 50, 0.7)') // Green color for nuclear reactors
        .attr('stroke', 'rgba(0, 100, 0, 0.9)')
        .attr('stroke-width', 1.5)
        .attr('class', 'nuclear-reactor')
        .on('mouseover', function(event, d) {
            d3.select(this)
            .attr('r', 9)
            .attr('fill', 'rgba(50, 205, 50, 0.9)');
            
            tooltip
            .style('opacity', 1)
            .html(`
                <strong>Nuclear Facility</strong><br>
                Name: ${d.name || 'Unknown'}<br>
                State: ${d.state || 'N/A'}<br>
                Type: ${d.type || 'Nuclear Facility'}
            `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
            .attr('r', 6)
            .attr('fill', 'rgba(50, 205, 50, 0.7)');
            
            tooltip.style('opacity', 0);
        });
    }

    // Add circular buffers around nuclear reactors (50km radius)
    if (nuclearReactorData.length > 0) {
        const bufferRadius = 50; // km
        const earthRadius = 6371; // km
        
        nuclearReactorData.forEach(reactor => {
        // Convert buffer radius from km to degrees (approximate)
        const bufferRadiusDegrees = (bufferRadius / earthRadius) * (180 / Math.PI);
        
        // Draw circle
        const circle = d3.geoCircle()
            .center([reactor.longitude, reactor.latitude])
            .radius(bufferRadiusDegrees);
        
        svg.append('path')
            .datum(circle())
            .attr('d', path)
            .attr('fill', 'rgba(50, 205, 50, 0.1)')
            .attr('stroke', 'rgba(50, 205, 50, 0.4)')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '5,5')
            .attr('class', 'reactor-buffer');
        });
    }
    
    // Add color legend for states
    const legendWidth = 200;
    const legendHeight = 15;
    const legendX = dimensions.width - legendWidth - 20;
    const legendY = dimensions.height - 40;

    const legendScale = d3.scaleLinear()
      .domain([0, d3.max(Array.from(sightingsByState.values()))])
      .range([0, legendWidth]);
      
    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d3.format(",.0f"));

    // Create gradient for legend
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'sightings-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.selectAll('stop')
      .data([0, 0.2, 0.4, 0.6, 0.8, 1])
      .join('stop')
      .attr('offset', d => d * 100 + '%')
      .attr('stop-color', d => colorScale(d * d3.max(Array.from(sightingsByState.values()))));

    // Add legend rectangle with gradient
    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#sightings-gradient)');

    // Add legend axis
    svg.append('g')
      .attr('transform', `translate(${legendX}, ${legendY + legendHeight})`)
      .call(legendAxis)
      .attr('font-size', '10px');

    // Add legend title
    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY - 5)
      .attr('font-size', '12px')
      .text('UFO Sightings by State');
    
    // Add main legend with UFO and military base symbols
    const mainLegend = svg.append('g')
      .attr('transform', `translate(20, ${dimensions.height - 80})`);
    
      
    // UFO sightings legend
    mainLegend.append('circle')
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', 5)
      .attr('fill', 'rgba(255, 215, 0, 0.6)')  
      .attr('stroke', 'rgba(255, 215, 0, 0.9)')
      .attr('stroke-width', 1);
      
    mainLegend.append('text')
      .attr('x', 25)
      .attr('y', 15)
      .text('UFO Sighting')
      .attr('font-size', '12px');
       
    // Military base legend  
    mainLegend.append('path')
      .attr('transform', 'translate(10, 40)')
      .attr('d', 'M-4,-4 L0,-8 L4,-4 L4,4 L-4,4 Z')
      .attr('fill', 'rgba(220, 20, 60, 0.7)')
      .attr('stroke', 'rgba(220, 20, 60, 0.9)')
      .attr('stroke-width', 1);
      
    mainLegend.append('text')
      .attr('x', 25)
      .attr('y', 45)
      .text('Military Base')
      .attr('font-size', '12px');
    
    // Nuclear reactor legend
    mainLegend.append('circle')
      .attr('cx', 10)
      .attr('cy', 70) // Position below military base entry
      .attr('r', 6)
      .attr('fill', 'rgba(50, 205, 50, 0.7)')
      .attr('stroke', 'rgba(0, 100, 0, 0.9)')
      .attr('stroke-width', 1.5);
    
    mainLegend.append('text')
      .attr('x', 25)
      .attr('y', 75) // Position below military base entry
      .text('Nuclear Reactor')
      .attr('font-size', '12px');

  }, [usMapData, ufoData, militaryBaseData, nuclearReactorData, dimensions]);
  
  return (
    <div className="map-container">
      <svg ref={svgRef}></svg>
      <div className="tooltip" ref={tooltipRef}></div>
    </div>
  );
};

export default MapVisualization;