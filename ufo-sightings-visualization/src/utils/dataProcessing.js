import Papa from 'papaparse';

export const processUFOData = (csvText) => {
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  
  // Process the data into the format we need
  return results.data.filter(sighting => {
    // Filter out entries without coordinates
    return sighting.latitude && sighting.longitude;
  }).map(sighting => {
    // Extract year from date
    const dateObj = new Date(sighting.datetime || sighting.date);
    const year = dateObj.getFullYear();
    
    return {
      ...sighting,
      year,
      latitude: parseFloat(sighting.latitude),
      longitude: parseFloat(sighting.longitude),
    };
  });
};

export const processMilitaryBaseData = (csvText) => {
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  
  // Process the data into the format we need
  return results.data.filter(base => {
    // Filter out entries without coordinates
    return base.latitude && base.longitude;
  }).map(base => {
    return {
      ...base,
      latitude: parseFloat(base.latitude),
      longitude: parseFloat(base.longitude),
    };
  });
};

export const processNuclearReactorData = (csvText) => {
    const results = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });
    
    return results.data.filter(reactor => {
      return reactor.latitude && reactor.longitude;
    }).map(reactor => {
      return {
        name: reactor.name,
        state: reactor.state,
        latitude: parseFloat(reactor.latitude),
        longitude: parseFloat(reactor.longitude),
        type: reactor.type || "Nuclear Facility"
      };
    });
  };