import {
  sliderBottom,
  format,
  range,
  interpolateRgb,
  scaleLinear,
  axisBottom,
  axisLeft,
  extent,
  max,
  line,
  curveMonotoneX,
  pointer,
} from 'd3';
import { worldMap } from './worldMap';
import { draw_scale_tooltip } from './tool_tips';

const year_slider = sliderBottom()
  .min(1850)
  .max(2023)
  .step(1)
  .width(240)
  .ticks(5);
const tickDensity = 0.03;

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
let sliderGroup = null;
let year_label = null;
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
//objects for autoadjust backgroundsizes
//let tooltip_background

export const map = (
  selection,
  dimensions,
  mapData,
  historicalData,
  mousedOverCountry,
  setYear,
  setMousedOverCountry,
  setDisplayedParameter,
  mousedData,
  setMousedData,
  mapSide,
  setMapSide,
) => {
  //set the background color
  selection
    .selectAll('rect.back')
    .data([null])
    .join('rect')
    .attr('class', 'back')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', '#FFFFFF');

  //render the world map
  selection.call(
    worldMap,
    dimensions,
    mapData,
    historicalData,
    mousedOverCountry,
    setYear,
    setMousedOverCountry,
    setMapSide,
  );

  //render other UI elements
  let background_opacity = 0.85;
  let UI = selection
    .selectAll('g.ui')
    .data([null])
    .join('g')
    .attr('class', 'ui')
    .attr(
      'transform',
      `translate(0,${dimensions.height * 0.8})`,
    )
    .attr('width', '100%')
    .attr('height', dimensions.height * 0.2);

  //Year Label
  UI.selectAll('rect.slider-background')
    .data([null])
    .join('rect')
    .attr('class', 'slider-background')
    .attr('x', '2.5%')
    .attr('y', '2.5%')
    .attr('width', '95%')
    .attr('height', '15%')
    .attr('fill', 'gray')
    .attr('fill-opacity', background_opacity)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('rx', 5);

  let year_label_background = UI.selectAll(
    'rect.year-label',
  )
    .data([null])
    .join('rect')
    .attr('class', 'year-label')
    .attr('fill', 'gray')
    .attr('fill-opacity', background_opacity)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('width', '11%')
    .attr('height', '10%')
    .attr('x', dimensions.width * 0.02 - 10)
    .attr('y', '-70%')
    .attr('rx', 5);

  let year_label_text = UI.selectAll('text.year-label')
    .data([null])
    .join('text')
    .attr('class', 'year-label')
    .attr('x', dimensions.width * 0.02)
    .attr('y', '-70%')
    .attr('font-size', '300%')
    .attr('font-weight', 'bold')
    .text(historicalData.year);

  let year_label_node = year_label_text.node();
  if (year_label_node) {
    const bbox = year_label_node.getBBox();
    year_label_background
      .attr('width', bbox.width + 20)
      .attr('height', bbox.height)
      .attr(
        'y',
        dimensions.height * -0.7 - bbox.height * 0.8,
      );
  }

  //Year Slider
  const sliderWidth = dimensions.width * 0.9;
  year_slider
    .default(historicalData.year)
    .width(sliderWidth)
    .tickFormat(format('d'))
    .on('onchange', (year) => {
      setYear(year);
    });
  UI.selectAll('g.year-slider')
    .data([null])
    .join('g')
    .attr('class', 'year-slider')
    .attr(
      'transform',
      `translate(${dimensions.width * 0.05}, ${dimensions.height * 0.1})`,
    )
    .call(year_slider);

  //color scale
  const gradient_count = 10;
  const gradient_width = 0.9 * dimensions.width;
  UI.selectAll('rect.gradient')
    .data(range(gradient_count))
    .join('rect')
    .attr('class', 'gradient')
    .attr('x', (d) => {
      return (
        (gradient_width / gradient_count) * d +
        (dimensions.width - gradient_width) / 2
      );
    })
    .attr('y', dimensions.height * 0.04)
    .attr('width', gradient_width / gradient_count)
    .attr('height', 20)
    .attr('fill', (d) => {
      let percent = d / (gradient_count - 1);
      switch (historicalData.unit) {
        case 'people':
          return p_color_interpolate(percent);
        case 'dollars':
          return g_color_interpolate(percent);
        default:
          return e_color_interpolate(percent);
      }
    })
    .attr('stroke', 'black')
    .attr('stroke-width', (d) => {
      if (mousedOverCountry) {
        if (mousedOverCountry in historicalData) {
          let index =
            (historicalData[mousedOverCountry] -
              historicalData.low_val) /
            (historicalData.high_val -
              historicalData.low_val);
          index = Math.floor(
            Math.pow(index, 1 / 5) / (1 / gradient_count),
          );
          if (
            d == index ||
            (d == gradient_count - 1 &&
              index == gradient_count)
          ) {
            return 2;
          }
        } else if (
          !isNaN(mousedOverCountry) &&
          typeof mousedOverCountry === 'number' &&
          mousedOverCountry >= 1 &&
          mousedOverCountry <= gradient_count &&
          d == mousedOverCountry - 1
        ) {
          return 2;
        }
      }
      return 0;
    })
    .on('mouseenter', (event, d) => {
      setMousedOverCountry(d + 1);

      //d.attr('stroke-width', 2);
    })
    .on('mouseleave', (event, d) => {
      setMousedOverCountry(null);
      selection.selectAll('g.tooltip').data([]).join('g');
      //d.attr('stroke-width', 0);
    })
    .on('mousemove', (event, d) => {
      draw_scale_tooltip(
        mousedOverCountry,
        selection,
        historicalData,
        gradient_count,
        get_units,
        dimensions,
      );
    });

  //Parameter button
  let data_button = UI.selectAll('g.data-button')
    .data([null])
    .join('g')
    .attr('class', 'data-button')
    .on('click', () => {
      switch (UI.select('text.data-button-text').text()) {
        case 'Population':
          setDisplayedParameter('gdp');
          break;
        case 'GDP':
          setDisplayedParameter('emissions');
          break;
        case 'Emissions':
          setDisplayedParameter('population');
          break;
        default:
          setDisplayedParameter('emissions');
      }
    });

  let data_button_background = data_button
    .selectAll('rect.data-selection')
    .data([null])
    .join('rect')
    .attr('class', 'data-selection')
    .attr('fill', 'gray')
    .attr('width', dimensions.width * 0.15)
    .attr('height', dimensions.height * 0.1)
    .attr('fill-opacity', background_opacity)
    .attr('stroke-width', 2)
    .attr('stroke', 'black')
    .attr('rx', 5)
    .attr('y', '-70%');

  let data_button_text = data_button
    .selectAll('text.data-button-text')
    .data([null])
    .join('text')
    .attr('class', 'data-button-text')
    .attr('x', dimensions.width * 0.02)
    .attr('y', '-70%')
    .attr('font-size', '300%')
    .attr('font-weight', 'bold')
    .text(() => {
      switch (historicalData['unit']) {
        case 'tons':
          return 'Emissions';
        case 'people':
          return 'Population';
        case 'dollars':
          return 'GDP';
      }
      return 'TEST';
    });
  let data_button_text_node = data_button_text.node();
  if (data_button_text_node) {
    const bbox = data_button_text_node.getBBox();
    data_button_background
      .attr('width', bbox.width + 20)
      .attr('height', bbox.height)
      .attr(
        'y',
        dimensions.height * -0.7 - bbox.height * 0.8,
      )
      .attr(
        'x',
        dimensions.width -
          bbox.width -
          20 -
          dimensions.width * 0.02,
      );
    data_button_text.attr(
      'x',
      dimensions.width -
        bbox.width -
        10 -
        dimensions.width * 0.02,
    );
  }

  //Scatter plot
  if (
    mousedOverCountry != null &&
    isNaN(mousedOverCountry)
  ) {
    let scatter_width = dimensions.width * 0.25;
    let scatter_height = dimensions.height * 0.4;
    let scatter_plot = UI.selectAll('g.scatter_plot')
      .data([null])
      .join('g')
      .attr('class', 'scatter_plot')
      .attr(
        'transform',
        `translate(${dimensions.width * 0.05 + (mapSide == 'right' ? 0 : dimensions.width * 0.68)},-${scatter_height + dimensions.height * 0.05})`,
      );
    scatter_plot
      .selectAll('rect.background')
      .data([null])
      .join('rect')
      .attr('class', 'background')
      .attr('fill', 'gray')
      .attr(
        'width',
        scatter_width + dimensions.width * 0.04,
      )
      .attr(
        'height',
        scatter_height + dimensions.height * 0.07,
      )
      .attr(
        'transform',
        `translate(${-dimensions.width * 0.04}, -${dimensions.height * 0.025})`,
      )
      .attr('fill-opacity', background_opacity)
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
      .attr('rx', 5);
    const data = Object.entries(mousedData)
      .map(([year, value]) => ({
        year: +year,
        value: +value,
      }))
      .sort((a, b) => a.year - b.year);

    const xScale = scaleLinear()
      .domain(extent(data, (d) => d.year))
      .range([0, scatter_width]);

    const yScale = scaleLinear()
      .domain([0, max(data, (d) => d.value)])
      .nice()
      .range([scatter_height, 0]);

    scatter_plot
      .selectAll('g.scat_bottom')
      .data([null])
      .join('g')
      .attr('class', 'scat_bottom')
      .attr('transform', `translate(0,${scatter_height})`)
      .call(
        axisBottom(xScale).tickFormat(format('d')).ticks(5),
      );

    scatter_plot
      .selectAll('g.scat_left')
      .data([null])
      .join('g')
      .attr('class', 'scat_left')
      .call(axisLeft(yScale).tickFormat(format('3.1s')));

    const scat_line = line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(curveMonotoneX);

    scatter_plot
      .selectAll('path.scatter_line')
      .data([data])
      .join('path')
      .datum(data)
      .attr('class', 'scatter_line')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('d', scat_line);
  } else {
    UI.selectAll('g.scatter_plot').data([]).join('g');
  }
};
