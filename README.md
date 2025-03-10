# UFO Sightings Visualization & Military Bases Visualization
IS219 Midterm Project - Spring 2025
## Essential Question
    Is there a correlation between UFO sighting reports and the locations of US military bases, and how have these sighting patterns evolved over time?
## Project Overview

This visualization allows users to explore decades of UFO sighting data alongside the locations of US military bases, presenting a unique opportunity to examine potential correlations between these phenomena.

### Key Features

- **Interactive US Map Visualization**
  - Dynamic rendering of UFO sightings as data points
  - Military base locations displayed as distinctive markers
  - Color-coded states based on sighting density
  - Tooltip information on hover for states, sightings, and bases

- **Supporting Visualizations**
  - Timeline chart showing UFO sighting frequency over time
  - Ranking chart displaying top states by number of sightings
  - Interactive elements for exploring the data in detail

- **Data Analysis Capabilities**
  - Examine geographical distribution patterns
  - Identify potential correlations between sightings and military installations
  - Explore temporal trends in reporting frequency

## Technology Stack

- **React** - Frontend library for building the user interface
- **D3.js** - Data visualization library for creating interactive charts
- **TopoJSON** - Library for efficient representation of geographic data
- **PapaParse** - CSV parsing functionality
- **Docker** - Containerization for development environment
- **GitHub Pages** - Hosting platform for the live demonstration

## Data Sources

This project combines data from multiple reliable sources:

- **UFO Sighting Reports** - Data sourced from the National UFO Reporting Center (NUFORC), spanning several decades of civilian reports across the United States
- **US Military Installations** - Comprehensive dataset of military bases across the country, including Army, Navy, Air Force, and Marine Corps facilities
- **US Geographic Data** - Detailed state boundary information for mapping functionality

## Key Observations

The visualization reveals several interesting patterns:

- California has the highest concentration of reported UFO sightings, followed by Washington and Florida
- There appears to be a higher density of sightings in coastal regions and areas with significant military presence
- Sighting reports have increased dramatically in recent decades, particularly since the 1990s
- Urban areas generally show higher concentrations of reports, but this may be influenced by population density

## Future Enhancements

- Add temporal filtering to examine sightings by decade or specific time periods
- Implement statistical analysis of proximity between sightings and military installations
- Incorporate additional data such as sighting descriptions and categorizations
- Add responsive design for better mobile viewing experience

## About the Project

This project was created as part of a data visualization exercise to explore real-world datasets through interactive web-based visualization. The application demonstrates the power of combining geographical data with temporal analysis to reveal patterns that might not be evident in raw data.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- National UFO Reporting Center for maintaining extensive records of sighting reports
- U.S. Department of Defense for providing military installation data
- The D3.js and React communities for their powerful tools and documentation
