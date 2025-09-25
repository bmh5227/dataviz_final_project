# Data Visualization Project

## Data

The data I propose to visualize for my project is historical CO2 Emissions in tons for each country on a per year basis. Depending on how the vizualization of the data goes, I might add additional information like population or gdp, so show the correlation of emissions with other attributes. Ex: emissions per capita for each coutry on a given year.


## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

 * How does the CO2 emissions vary over time?
 * Is there any correlation between emissions and population/gdp?
 * Do regions of world increase/decrease their emissions in unison, or is this a per country trend?

## Sketches
This is the intial set of sketch ideas:

![image](https://github.com/bmh5227/dataviz_final_project/blob/master/general_sketch_ideas.jpg)

Based on this set of ideas I like the idea of vizually showing the earth and highlighting the countries that produce the most emissions. After some peer feed back I created this second iteration of the sketch:

![image](https://github.com/bmh5227/dataviz_final_project/blob/master/world_map_sketch.jpg)

## Prototypes

The first proof of concept I created was a scatter plot showing CO2 emission over time for each country:
```
![image](https://github.com/bmh5227/dataviz_final_project/blob/master/scatter_plot_example.png)
(https://vizhub.com/bmh5227/db1ba255a79b47948c71c1639139ae50)
```

I found it difficult to get a sense of what each individual company was up to except for the top few. This is why I decide to go with a more geospacial approach. From there I created my first prototype, where you can see the emission for each country based on the year:

![image](https://github.com/bmh5227/dataviz_final_project/blob/master/proto_type_screen_shot.png)
(https://vizhub.com/bmh5227/4b563c7d607847db8a2062bb7a89fdb5)

This is the data source:
(https://github.com/owid/co2-data?tab=readme-ov-file)

## Open Questions

The biggest concern I have is if I will be able to display enough information, so that the end user will be able to derive more information than just "This country produces a lot of CO2". This will be the importance of the tool tip.

## Milestones
- Add a slider bar to adjust the year from the window, rather than in the code
- Needs to be refactored (the code is very messy at the moment)
- Add a tool tip to show additional information when clicking/mousing over a country
- Possibly add other data bases like population and gdp historical data to show the correlation between emissions and other attributes
