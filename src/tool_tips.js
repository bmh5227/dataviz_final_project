export const draw_scale_tooltip = (
  mousedOverCountry,
  selection,
  historicalData,
  gradient_count,
  get_units,
  dimensions,
) => {
  if (mousedOverCountry != null) {
    let d = parseInt(mousedOverCountry, 10) - 1;
    let tooltip = selection
      .selectAll('g.tooltip')
      .data([null])
      .join('g')
      .attr('class', 'tooltip')
      .attr(
        'transform',
        `translate(${event.x + 15}, ${event.y})`,
      )
      .attr('pointer-events', 'none');
    let tooltipBackground = tooltip
      .selectAll('rect.background')
      .data([null])
      .join('rect')
      .attr('class', 'background')
      .attr('width', 50)
      .attr('height', 40)
      .attr('fill', 'gray')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('rx', 5);

    let historical_data_range =
      historicalData.high_val - historicalData.low_val;
    let lower_bound_unit = '';
    let lower_bound =
      Math.pow(d / gradient_count, 5) *
        historical_data_range +
      historicalData.low_val;

    let lower = get_units(lower_bound);
    let upper_bound =
      Math.pow((d + 1) / gradient_count, 5) *
        historical_data_range +
      historicalData.low_val;
    let upper = get_units(upper_bound);
    let tooltipText = tooltip
      .selectAll('text.text_range')
      .data([null])
      .join('text')
      .attr('class', 'text_range')
      .attr('x', 5)
      .attr('y', 25)
      .text(
        `${lower.value.toFixed(2)} ${lower.unit} to ${upper.value.toFixed(2)} ${upper.unit} ${historicalData['unit']}`,
      );
    let toolTipBackgroundNode = tooltipBackground.node();
    let toolTipTextNode = tooltipText.node();
    if (toolTipBackgroundNode && toolTipTextNode) {
      let textBox = toolTipTextNode.getBBox();
      tooltipBackground.attr('width', textBox.width + 10);
      let toolTipBackgroundBox =
        toolTipBackgroundNode.getBBox();
      let x = event.x + 15;
      if (event.x > dimensions.width / 2) {
        x = x - toolTipBackgroundBox.width - 15;
      }
      tooltip.attr(
        'transform',
        `translate(${x}, ${event.y})`,
      );
    }
  }
};

export const draw_map_tooltip = (
  selection,
  event,
  mousedOverCountry,
  historicalData,
  dimensions,
  setMapSide,
) => {
  //Sets up the tooltip
  if (mousedOverCountry != null) {
    let tooltip = selection
      .selectAll('g.tooltip')
      .data([null])
      .join('g')
      .attr('class', 'tooltip')
      .attr(
        'transform',
        `translate(${event.x + 15}, ${event.y})`,
      )
      .attr('pointer-events', 'none');
    let tooltipBackground = tooltip
      .selectAll('rect.background')
      .data([null])
      .join('rect')
      .attr('class', 'background')
      .attr('width', 50)
      .attr('height', 40)
      .attr('fill', 'gray')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('rx', 5);
    let country_name_text = tooltip
      .selectAll('text.country_name')
      .data([null])
      .join('text')
      .attr('class', 'country_name')
      .attr('x', 5)
      .attr('y', 15)
      .text(mousedOverCountry);

    let country_emissions_text = tooltip
      .selectAll('text.country_emissions')
      .data([null])
      .join('text')
      .attr('class', 'country_emissions')
      .attr('x', 5)
      .attr('y', 30);
    if (mousedOverCountry in historicalData) {
      let emissions = historicalData[mousedOverCountry];
      let emissions_rounded = emissions;
      let emissions_unit = '';
      if (emissions > 1000000000) {
        emissions_rounded = emissions / 1000000000.0;
        emissions_unit = 'billion';
      } else if (emissions > 1000000) {
        emissions_rounded = emissions / 1000000.0;
        emissions_unit = 'million';
      }
      country_emissions_text.text(
        `${emissions_rounded.toFixed(2)} ${emissions_unit} ${historicalData['unit']}`,
      );
    } else {
      country_emissions_text.text('No Data');
    }
    const emissionsTextNode = country_emissions_text.node();
    const countryNameTextNode = country_name_text.node();
    const toolTipBackgroundNode = tooltipBackground.node();
    if (
      emissionsTextNode &&
      countryNameTextNode &&
      toolTipBackgroundNode
    ) {
      const emissionsBox = emissionsTextNode.getBBox();
      const nameBox = countryNameTextNode.getBBox();
      tooltipBackground.attr(
        'width',
        Math.max(emissionsBox.width, nameBox.width) + 10,
      );
      const tooltipBox = toolTipBackgroundNode.getBBox();
      let x = event.x + 15;

      if (event.x > dimensions.width / 2) {
        x = x - tooltipBox.width - 15;
        setMapSide('right');
      } else {
        setMapSide('left');
      }
      tooltip.attr(
        'transform',
        `translate(${x}, ${event.y})`,
      );
    }
  }
};
