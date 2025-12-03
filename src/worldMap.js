import {
  geoNaturalEarth1,
  geoPath,
  geoGraticule,
  sliderBottom,
  format,
  scaleLinear,
  range,
  interpolateRgb,
} from 'd3';

import {
  draw_map_tooltip,
  draw_scale_tooltip,
} from './tool_tips';

const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticule = geoGraticule();

//population colors
const p_start_color = '#0d97db';
const p_stop_color = '#e86b0c';
const p_color_interpolate = interpolateRgb(
  p_start_color,
  p_stop_color,
);

//gdp colors
const g_start_color = '#E4080A';
const g_stop_color = '#1BBE3F';
const g_color_interpolate = interpolateRgb(
  g_start_color,
  g_stop_color,
);

//emissions colors
const e_start_color = '#1BBE3F';
const e_stop_color = '#E4080A';
const e_color_interpolate = interpolateRgb(
  e_start_color,
  e_stop_color,
);
const gradient_count = 10;

const colorScale = scaleLinear()
  .domain([0, 1])
  .range(['green', 'red']);

function get_units(value) {
  let result = value;
  let unit = '';
  if (value > 1000000000) {
    result = value / 1000000000;
    unit = 'billion';
  } else if (value > 1000000) {
    result = value / 1000000;
    unit = 'million';
  }

  return { value: result, unit: unit };
}

export const worldMap = (
  selection,
  dimensions,
  mapData,
  historicalData,
  mousedOverCountry,
  setYear,
  setMousedOverCountry,
  setMapSide,
) => {
  selection.on('wheel.zoomYear', (event) => {
    event.preventDefault();

    if (!historicalData) return;

    const delta = Math.sign(event.deltaY); // +1 = scroll down, -1 = scroll up
    let newYear = historicalData.year - delta;

    newYear = Math.max(1850, Math.min(2023, newYear));

    if (newYear !== historicalData.year) {
      setYear(newYear);
      if (mousedOverCountry != null) {
        if (isNaN(mousedOverCountry)) {
          draw_map_tooltip(
            selection,
            event,
            mousedOverCountry,
            historicalData,
            dimensions,
          );
        } else {
          draw_scale_tooltip(
            mousedOverCountry,
            selection,
            historicalData,
            gradient_count,
            get_units,
            dimensions,
          );
        }
      }
    }
  });

  let worldMap_selection = selection
    .selectAll('g.worldMap')
    .data([null])
    .join('g')
    .attr('class', 'worldMap')
    .attr('transform', 'translate(0, 10)');

  if (true) {
    const groupWidth = dimensions.width;
    const groupHeight = dimensions.height * 0.8;
    projection.fitSize([groupWidth, groupHeight], mapData);
  }
  //Outline of map
  worldMap_selection
    .selectAll('path.outline')
    .data([null])
    .join('path')
    .attr('class', 'outline')
    .attr('d', path(graticule.outline()))
    .attr('fill', '#B3E2FF')
    .attr('stroke', 'black')
    .attr('stroke-width', 2);

  //World lines
  worldMap_selection
    .selectAll('path.graticule')
    .data([null])
    .join('path')
    .attr('class', 'graticule')
    .attr('d', path(graticule()))
    .attr('fill', 'none')
    .attr('stroke', '#BBB')
    .attr('stroke-width', 0.5);

  const colorRange =
    historicalData.high_val - historicalData.low_val;

  //countries
  worldMap_selection
    .selectAll('path.country')
    .data(mapData.features)
    .join('path')
    .attr('d', path)
    .attr('class', 'country')
    .attr('stroke', 'black')
    .attr('stroke-width', (d) => {
      if (
        mousedOverCountry !== null &&
        d.properties.name == mousedOverCountry
      ) {
        return 2;
      }
      return 0.5;
    })
    .attr('fill', (d) => {
      let country_name = d.properties.name;
      if (!(country_name in historicalData)) {
        return 'gray';
      }

      let color_val =
        (historicalData[country_name] -
          historicalData.low_val) /
        (historicalData.high_val - historicalData.low_val);
      color_val = Number.isNaN(color_val)
        ? 0
        : Math.pow(color_val, 1 / 5);
      switch (historicalData.unit) {
        case 'people':
          return p_color_interpolate(color_val);
        case 'dollars':
          return g_color_interpolate(color_val);
        default:
          return e_color_interpolate(color_val);
      }
    })
    .attr('fill-opacity', (d) => {
      if (
        mousedOverCountry === null ||
        d.properties.name == mousedOverCountry
      ) {
        return 1.0;
      } else if (
        !isNaN(mousedOverCountry) &&
        typeof mousedOverCountry === 'number' &&
        mousedOverCountry >= 1 &&
        mousedOverCountry <= gradient_count
      ) {
        //At this point we are working with a number
        let color_val =
          (historicalData[d.properties.name] -
            historicalData.low_val) /
          (historicalData.high_val -
            historicalData.low_val);
        color_val = Number.isNaN(color_val)
          ? 0
          : Math.pow(color_val, 1 / 5);
        color_val = Math.floor(color_val * gradient_count);
        if (
          color_val == mousedOverCountry - 1 ||
          (color_val == gradient_count &&
            mousedOverCountry == gradient_count)
        ) {
          return 1;
        }
      }
      return 0.3;
    })
    .on('mouseenter', (event, d) => {
      setMousedOverCountry(d.properties.name);
      console.log('Setting country');
    })
    .on('mouseleave', (event, d) => {
      setMousedOverCountry(null);
      selection.selectAll('g.tooltip').data([]).join('g');
    })
    .on('mousemove', (event) => {
      draw_map_tooltip(
        selection,
        event,
        mousedOverCountry,
        historicalData,
        dimensions,
        setMapSide,
      );
    });
};
