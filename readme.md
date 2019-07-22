# Language Levenshtein Distance

## Python Script
* Uses Swadesh lists (sourced from Wiktionary) to calculate average Levenshtein distance between pairs of languages.
* To use, add Swadesh list as CSV file to `swadesh_lists` folder, and the language to the `languages` list in `main.py`.
* In addition, special character distances can be set using the following syntax in the CSV file:
    `accept,{cost},{character 1},{character 2}`
* The resulting output CSV will go into the `output.csv` file after running `main.py`, and this can be copied to the graphing page.

## Graphing Webpage
* Uses D3.js to visualize average Levenshtein distances between languages.
* The file `csv.js` contains all of the options, including the output CSV from the Python script (`csv`), the list of languages (`languageOptions`), and language group definitions (`languageGroups`).
* Language group definitions are structured as follows:
    `{`
        `name: {language group name},`
        `langs: [{languages included}]`
    `}`
* Hovering over a language in a graph will show the raw Levenshtein distances for all languages and the language being hovered over.
* The redder a language is, the greater its average Levenshtein distance with all others on the graph (this scale is relative to each graph).