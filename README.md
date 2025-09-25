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

IMAGe

Based on this set of ideas I like the idea of vizually showing the earth and highlighting the countries that produce the most emissions. After some peer feed back I created this second iteration of the sketch:

IMAGE

## Prototypes

The first proof of concept I created was a scatter plot showing CO2 emission over time for each country:

IMAGE
[![image]()]
(https://vizhub.com/bmh5227/db1ba255a79b47948c71c1639139ae50)

I found it difficult to get a sense of what each individual company was up to except for the top few. This is why I decide to go with a more geospacial approach. From there I created my first prototype, where you can see the emission for each country based on the year:

IMAGE

[![image](https://user-images.githubusercontent.com/68416/65240758-9ef6c980-daff-11e9-9ffa-e35fc62683d2.png)](https://vizhub.com/curran/eab039ad1765433cb51aad167d9deae4)

(please put a screenshot of one or more visualizations of this dataset you already made, for previous assignments, and link to them)

You can put images into here by pasting them into issues.

You can make images into links like this:

```
[![image](https://user-images.githubusercontent.com/68416/65240758-9ef6c980-daff-11e9-9ffa-e35fc62683d2.png)](https://vizhub.com/curran/eab039ad1765433cb51aad167d9deae4)
```


Also, you can study the [source](https://raw.githubusercontent.com/curran/dataviz-project-template-proposal/master/README.md) to figure out Markdown formatting. You can use the GitHub built-in editor to edit the document.

## Open Questions

(describe any fear, uncertainty, or doubt you’re having about the feasibility of implementing the sketched system. For example, “I’m not sure where to get the geographic shapes to build a map from this data” or “I don’t know how to resolve the codes to meaningful names” … Feel free to delete this section if you’re confident.)

## Milestones
- Add a slider bar to adjust the year from the window, rather than in the code
- Needs to be refactored (the code is very messy at the moment)
- Add a tool tip to show additional information when clicking/mousing over a country
- Possibly add other data bases like population and gdp historical data to show the correlation between emissions and other attributes
