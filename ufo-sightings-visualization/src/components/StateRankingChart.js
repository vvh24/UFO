import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import '../styles/components/StateRankingChart.css';

const StateRankingChart = ({ ufoData }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = svgRef.current.parentElement.clientWidth;
      setDimensions({
        width: containerWidth,
        height: 400, // Fixed height
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Draw bar chart
  useEffect(() => {
    if (!ufoData.length || !dimensions.width || !dimensions.height) return;
    
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    
    // Clear previous rendering
    svg.selectAll('*').remove();
    
    svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('viewBox', [0, 0, dimensions.width, dimensions.height])
      .attr('style', 'max-width: 100%; height: auto;');
    
    // Add title
    svg.append('text')
      .attr('x', dimensions.width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Top 10 States by UFO Sightings');
    
    // Set margins
    const margin = { top: 40, right: 30, bottom: 60, left: 70 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;
    
    // Group data by state
    const stateCounts = d3.rollup(
      ufoData,
      v => v.length,
      d => d.state
    );
    
    // Convert to array and sort by count descending
    const stateData = Array.from(stateCounts, ([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Get top 10
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.count) * 1.1])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleBand()
      .domain(stateData.map(d => d.state))
      .range([0, innerHeight])
      .padding(0.2);
    
    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(10);
    
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);
    
    const yAxis = d3.axisLeft(yScale);
    
    g.append('g')
      .call(yAxis);
    
    // Add axis labels
    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + 40})`)
      .style('text-anchor', 'middle')
      .text('Number of Sightings');
    
    // Add bars
    g.selectAll('.bar')
      .data(stateData)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => yScale(d.state))
      .attr('width', d => xScale(d.count))
      .attr('height', yScale.bandwidth())
      .attr('fill', 'steelblue')
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.state}</strong>: ${d.count} sightings`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });
    
  }, [ufoData, dimensions]);
  
  return (
    <div className="state-ranking-container">
      <svg ref={svgRef}></svg>
      <div className="tooltip" ref={tooltipRef}></div>
    </div>
  );
};

export default StateRankingChart;