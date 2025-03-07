import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import '../styles/components/MapVisualization.css';

const MapVisualization = ({ ufoData, militaryBaseData, usMapData }) => {
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
    
    // Draw states
    const states = svg.append('g')
      .selectAll('path')
      .data(topojson.feature(usMapData, usMapData.objects.states).features)
      .join('path')
      .attr('fill', '#f2f2f2')
      .attr('stroke', '#999')
      .attr('stroke-width', 0.5)
      .attr('d', path)
      .attr('class', 'state');
      
    // Color states based on UFO sighting density
    const sightingsByState = d3.rollup(
      ufoData,
      v => v.length,
      d => d.state
    );
    
    // Color scale for states based on number of sightings
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(Array.from(sightingsByState.values()))]);
    
    states.attr('fill', d => {
      const stateName = d.properties.name;
      const stateCode = d.properties.code;
      const count = sightingsByState.get(stateCode) || 0;
      return colorScale(count);
    });
    
    // Add UFO sightings
    svg.append('g')
      .selectAll('circle')
      .data(ufoData)
      .join('circle')
      .attr('cx', d => {
        const [x, y] = projection([d.longitude, d.latitude]);
        return x;
      })
      .attr('cy', d => {
        const [x, y] = projection([d.longitude, d.latitude]);
        return y;
      })
      .attr('r', 3)
      .attr('fill', 'rgba(255, 215, 0, 0.6)')  // Gold color with transparency
      .attr('stroke', 'rgba(255, 215, 0, 0.9)')
      .attr('stroke-width', 1)
      .attr('class', 'ufo-sighting');
    
    // Add military bases
    if (militaryBaseData.length > 0) {
      svg.append('g')
        .selectAll('path')
        .data(militaryBaseData)
        .join('path')
        .attr('transform', d => {
          const [x, y] = projection([d.longitude, d.latitude]);
          return `translate(${x}, ${y})`;
        })
        .attr('d', 'M-5,-5 L0,-10 L5,-5 L5,5 L-5,5 Z') // Pentagon shape for military bases
        .attr('fill', 'rgba(220, 20, 60, 0.7)') // Crimson color with transparency
        .attr('stroke', 'rgba(220, 20, 60, 0.9)')
        .attr('stroke-width', 1)
        .attr('class', 'military-base');
    }
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(20, ${dimensions.height - 80})`);
      
    // UFO sightings legend
    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', 5)
      .attr('fill', 'rgba(255, 215, 0, 0.6)')  
      .attr('stroke', 'rgba(255, 215, 0, 0.9)')
      .attr('stroke-width', 1);
      
    legend.append('text')
      .attr('x', 25)
      .attr('y', 15)
      .text('UFO Sighting')
      .attr('font-size', '12px');
      
    // Military base legend  
    legend.append('path')
      .attr('transform', 'translate(10, 40)')
      .attr('d', 'M-4,-4 L0,-8 L4,-4 L4,4 L-4,4 Z')
      .attr('fill', 'rgba(220, 20, 60, 0.7)')
      .attr('stroke', 'rgba(220, 20, 60, 0.9)')
      .attr('stroke-width', 1);
      
    legend.append('text')
      .attr('x', 25)
      .attr('y', 45)
      .text('Military Base')
      .attr('font-size', '12px');
      
  }, [usMapData, ufoData, militaryBaseData, dimensions]);
  
  return (
    <div className="map-container">
      <svg ref={svgRef}></svg>
      <div className="tooltip" ref={tooltipRef}></div>
    </div>
  );
};

export default MapVisualization;