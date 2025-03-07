import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import '../styles/components/TimelineChart.css';

const TimelineChart = ({ ufoData, yearRange }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = svgRef.current.parentElement.clientWidth;
      setDimensions({
        width: containerWidth,
        height: 300, // Fixed height
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Draw timeline chart
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
      .text('UFO Sightings Over Time');
    
    // Set margins
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;
    
    // Aggregate data by year
    const yearCounts = d3.rollup(
      ufoData,
      v => v.length,
      d => d.year
    );
    
    // Convert to array for line chart
    const yearData = Array.from(yearCounts, ([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(yearData, d => d.year), d3.max(yearData, d => d.year)])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(yearData, d => d.count) * 1.1]) // Add 10% padding
      .range([innerHeight, 0]);
    
    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d => d);
    
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(10);
    
    g.append('g')
      .call(yAxis);
    
    // Add axis labels
    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + 40})`)
      .style('text-anchor', 'middle')
      .text('Year');
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .style('text-anchor', 'middle')
      .text('Number of Sightings');
    
    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.count))
      .curve(d3.curveMonotoneX);
    
    // Add the line
    g.append('path')
      .datum(yearData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Add dots for each data point
    g.selectAll('.dot')
      .data(yearData)
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.count))
      .attr('r', 4)
      .attr('fill', 'steelblue')
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.year}</strong>: ${d.count} sightings`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });
    
  }, [ufoData, dimensions]);
  
  return (
    <div className="timeline-container">
      <svg ref={svgRef}></svg>
      <div className="tooltip" ref={tooltipRef}></div>
    </div>
  );
};

export default TimelineChart;