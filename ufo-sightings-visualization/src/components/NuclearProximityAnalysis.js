import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const NuclearProximityAnalysis = ({ ufoData, nuclearReactorData }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = svgRef.current.parentElement.clientWidth;
      setDimensions({
        width: containerWidth,
        height: 300,
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Draw proximity analysis chart
  useEffect(() => {
    if (!ufoData.length || !nuclearReactorData.length || !dimensions.width || !dimensions.height) return;
    
    const svg = d3.select(svgRef.current);
    
    // Clear previous rendering
    svg.selectAll('*').remove();
    
    svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('viewBox', [0, 0, dimensions.width, dimensions.height])
      .attr('style', 'max-width: 100%; height: auto;');
    
    // Calculate distance from each UFO sighting to the nearest nuclear reactor
    const sightingsWithDistance = ufoData.map(sighting => {
      // Use Haversine formula to calculate distances
      const distances = nuclearReactorData.map(reactor => {
        const R = 6371; // Earth's radius in km
        const dLat = (reactor.latitude - sighting.latitude) * Math.PI / 180;
        const dLon = (reactor.longitude - sighting.longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(sighting.latitude * Math.PI / 180) * Math.cos(reactor.latitude * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      });
      
      return {
        ...sighting,
        nearestReactorDistance: Math.min(...distances)
      };
    });
    
    // Group sightings by distance ranges
    const distanceRanges = [10, 25, 50, 100, 200, 500, 1000];
    const distanceCounts = distanceRanges.map(maxDist => {
      const count = sightingsWithDistance.filter(s => s.nearestReactorDistance <= maxDist).length;
      return { 
        distance: maxDist, 
        count, 
        percentage: (count / sightingsWithDistance.length) * 100 
      };
    });
    
    // Set margins
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;
    
    // Set up scales
    const xScale = d3.scaleBand()
      .domain(distanceRanges.map(d => d.toString()))
      .range([0, innerWidth])
      .padding(0.2);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(distanceCounts, d => d.percentage) * 1.1])
      .range([innerHeight, 0]);
    
    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Add title
    svg.append('text')
      .attr('x', dimensions.width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('UFO Sightings by Distance to Nearest Nuclear Reactor');
    
    // Add axes
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);
    
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => `${d}%`);
    g.append('g')
      .call(yAxis);
    
    // Add axis labels
    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + 40})`)
      .style('text-anchor', 'middle')
      .text('Distance to Nearest Nuclear Reactor (km)');
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .style('text-anchor', 'middle')
      .text('Percentage of UFO Sightings');
    
    // Add bars
    g.selectAll('.bar')
      .data(distanceCounts)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.distance.toString()))
      .attr('y', d => yScale(d.percentage))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.percentage))
      .attr('fill', 'rgba(50, 205, 50, 0.7)')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('fill', 'rgba(50, 205, 50, 0.9)');
          
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(255, 255, 255, 0.9)')
          .style('padding', '10px')
          .style('border', '1px solid #ddd')
          .style('border-radius', '4px')
          .style('pointer-events', 'none')
          .style('opacity', 0);
          
        tooltip
          .style('opacity', 1)
          .html(`
            <strong>Within ${d.distance} km of a nuclear reactor:</strong><br>
            ${d.count.toLocaleString()} UFO sightings (${d.percentage.toFixed(2)}%)
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('fill', 'rgba(50, 205, 50, 0.7)');
          
        d3.selectAll('.tooltip').remove();
      });
    
    // Add value labels on top of bars
    g.selectAll('.bar-label')
      .data(distanceCounts)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.distance.toString()) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.percentage) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .text(d => `${d.percentage.toFixed(1)}%`);
    
  }, [ufoData, nuclearReactorData, dimensions]);
  
  return (
    <div className="nuclear-proximity-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default NuclearProximityAnalysis;