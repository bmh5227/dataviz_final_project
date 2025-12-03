import {
  useState,
  useEffect,
  useRef,
  createElement,
} from 'react';
import { select, csv, sliderBottom, range } from 'd3';
import { map } from './map';

const worldAtlasURL =
  'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/110m.json';
const defaultYear = 2020;

export const App = () => {
  const svgRef = useRef();
  const [mapData, setMapData] = useState(null);
  const [year, setYear] = useState(defaultYear);
  const [historicalData, setHistoricalData] =
    useState(null);
  const [countryColorMappings, setCountryColorMappings] =
    useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [mousedOverCountry, setMousedOverCountry] =
    useState(null);
  const [mousedData, setMousedData] = useState({});
  let moused_over_country_data = {};
  const [displayedParameter, setDisplayedParameter] =
    useState('emissions');
  const [mapSide, setMapSide] = useState('none');
  const svg = select(svgRef.current)
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);
  let defs = svg.select('defs');
  if (defs.empty()) {
    defs = svg.append('defs');
  }

  if (defs.select('#greenRedGradient').empty()) {
    console.log('Defining gradient');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'greenRedGradient')
      .attr('x1', '0%') // Start point of the gradient
      .attr('y1', '0%')
      .attr('x2', '0%') // End point of the gradient
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'green');

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'red');
  }

  useEffect(() => {
    if (mapData === null) {
      fetch(worldAtlasURL)
        .then((response) => response.json())
        .then((topoJSONData) => {
          const countriesData = topojson.feature(
            topoJSONData,
            topoJSONData.objects.countries,
          );
          setMapData(countriesData);
        });
    }
    if (historicalData === null) {
      csv('filtered_data.csv').then((loadedData) => {
        setHistoricalData(
          loadedData.map((d, i) => ({
            ...d,
            country_name: d.country_name,
            year: +d.year,
            emissions: +d.emissions * 1000000,
            population: +d.population,
            gdp: +d.gdp,
          })),
        );
      });
    }
    const resizeWindow = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', resizeWindow);
  }, []);

  useEffect(() => {
    if (historicalData != null) {
      let tmp_mappings = {
        high_val: Number.MIN_SAFE_INTEGER,
        low_val: Number.MAX_SAFE_INTEGER,
        year: year,
      };
      let moused_over_country_data = {};
      historicalData.forEach((dataPoint) => {
        let value = dataPoint[displayedParameter];
        if (
          !Number.isNaN(dataPoint.year) &&
          !Number.isNaN(value)
        ) {
          if (dataPoint.year == year) {
            tmp_mappings[dataPoint.country_name] = value;
            let cc = dataPoint.country_code;
            if (cc && cc.length == 3)
              tmp_mappings.high_val = Math.max(
                tmp_mappings.high_val,
                value,
              );
            tmp_mappings.low_val = Math.min(
              tmp_mappings.low_val,
              value,
            );
          }
          if (
            mousedOverCountry != null &&
            dataPoint.country_name == mousedOverCountry &&
            dataPoint[displayedParameter] != null
          ) {
            moused_over_country_data[dataPoint.year] =
              dataPoint[displayedParameter];
          }
        }
      });
      switch (displayedParameter) {
        case 'emissions':
          tmp_mappings['unit'] = 'tons';
          break;
        case 'population':
          tmp_mappings['unit'] = 'people';
          break;
        case 'gdp':
          tmp_mappings['unit'] = 'dollars';
          break;
        default:
          tmp_mappings['unit'] = displayedParameter;
      }
      if (mousedOverCountry != null) {
        setMousedData(moused_over_country_data);
      } else {
        setMousedData({});
      }

      setCountryColorMappings(tmp_mappings);
    } else {
      console.log('Historical Data not loaded');
    }
  }, [
    historicalData,
    year,
    displayedParameter,
    mousedOverCountry,
    mapSide,
  ]);

  useEffect(() => {
    if (mapData != null && countryColorMappings != null) {
      svg
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);
      svg.call(
        map,
        dimensions,
        mapData,
        countryColorMappings,
        mousedOverCountry,
        setYear,
        setMousedOverCountry,
        setDisplayedParameter,
        mousedData,
        setMousedData,
        mapSide,
        setMapSide,
      );
    }
  }, [mapData, countryColorMappings, dimensions]);

  return createElement('svg', {
    ref: svgRef,
    width: dimensions.width,
    height: dimensions.height,
  });
};
