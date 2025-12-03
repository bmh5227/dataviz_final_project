
# Data Visualization Project
## Introduction
In this data viz my goal is to let the user explore historical CO2 emissions on a per country basis. The user is also able to display other attributes, such as population and gdp. This allows you to ask questions in relation to other attributes and see the trends.

## Data
Source: https://github.com/owid/co2-data
Numerous datapoints and attributes have been removed to create a more compact dataset.
The remaining attributes are:
- Emissions
- Population
- Gdp

## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

 * How does the CO2 emissions vary over time?
 * Is there any correlation between emissions and population/gdp?
 * Do regions of world increase/decrease their emissions in unison, or is this a per country trend?
 * Can you see correlations between real world events and changes in emissions

## Sketches
I sketches various ways in which I could possibly visualize this data set:

![image](https://github.com/bmh5227/dataviz_final_project/blob/master/general_sketch_ideas.jpg)

Based on this set of ideas, I like the idea of geographically showing emissions by highlighting the countries that produce the most. After some peer feed back, I created this second iteration of the sketch:

![image](https://github.com/bmh5227/dataviz_final_project/blob/master/world_map_sketch.jpg)

## Prototypes

The first proof of concept I created was a scatter plot showing CO2 emission over time for each country:
![image](https://github.com/bmh5227/dataviz_final_project/blob/master/scatter_plot_example.png)
(https://vizhub.com/bmh5227/db1ba255a79b47948c71c1639139ae50)

I found it difficult to get a sense of what each individual country was up to except for the top few. This is why I decide to go with a more geospacial approach. From there I created my first prototype, where you can see the emission for each country based on the year:

![image](https://github.com/bmh5227/dataviz_final_project/blob/master/proto_type_screen_shot.png)
(https://vizhub.com/bmh5227/4b563c7d607847db8a2062bb7a89fdb5)

This is the data source:
(https://github.com/owid/co2-data?tab=readme-ov-file)

## Project History
### Version 1
Using the ideas I created while prototyping I decided to go with the map representation. This is the first iteration of that idea:
![image](https://github.com/bmh5227/dataviz_final_project/blob/master/map_v1.png)
(https://vizhub.com/bmh5227/e52a7a28e4fc44d3a1842aa64ed5f4dd)
Changes:
- Refactored the initial map prototype to use the TopoJson and the built in map utilities within d3.
- Switched to a different dataset
- Added a slider to change the year being displayed
- Switched to a Green -> Red color scale

### Version 2

![image](https://github.com/bmh5227/dataviz_final_project/blob/master/map_v2.png)
(https://vizhub.com/bmh5227/f1c2ea9d9b074138bd66e1169080c5bd)

Changes:
- Added a key
- Added a year label
- Some minor formatting changes based on peer feedback
- Map reacts to resizing of window

### Version 3

![image](https://github.com/bmh5227/dataviz_final_project/blob/master/map_v3.png)
(https://vizhub.com/bmh5227/4ee49c2f77094e8ca7cbe31f81377f02)

Changes:
- Added mousing over of countries
- Key now updates to match the country being moused over
- Again some minor formatting changes addressing peer feedback

### Version 4
(https://vizhub.com/bmh5227/4ee49c2f77094e8ca7cbe31f81377imf02)
![image](https://github.com/bmh5227/dataviz_final_project/blob/master/dataviz_v4.png)
Changes:
- Redesigned the UI
- Added tooltips for mousing over countries
- Added tooltips for mousing over the key
- Added Highlighting of countries when mousing over the key

### Version 5
![image](https://github.com/bmh5227/dataviz_final_project/blob/master/dataviz_v5.png)
(https://vizhub.com/bmh5227/c23ac12c2a09455a9c46fcb93c1e8518)
Changes:
- Added a label in the top right that can be clicked
- Clicking this label will result in the data being displayed to switch to a different attribute
- Added displaying of these ^ attributes

### Version 6

(https://vizhub.com/bmh5227/abe221f1c6d5495dbd05c3277238e1f5)
Changes:
- Addressed peer feedback by changing attribute colorings
- Changed the naming of attributes in the new label that was created last iteration
- Fixed other minor bugs found during peer review

### Version 7 (Final Iteration)

(https://vizhub.com/bmh5227/b740004b868548bf9b8880ef7bf7113d)
For this final iteration I focused on adding features that made the visualization feel the most polished and complete. 

Changes:
- Added use of the scroll wheel to change the year
- Added a line graph that will show all historical data for the country moused over
- Scaling of max and mins to the year being displayed
- Fixed varous bugs the made the viz clunky

## Conclusion
Overall, I was able to create a data vizualization that will let you address the initial question asked. You are able to look at historical CO2 emission on per country basis, as well as find correlations between emissions and other attributes like population and gdp. There is plenty of user interation and feed back, that I feel makes the viz inituitive and easy to come up with many of your own question. Beyond the data viz itself, I certainly learn a lot about not only vizual encoding techniques (what works well and what doesn't), but also JavaScript, NodeJS, and D3. 
