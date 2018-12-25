# R6 Operator Counters

A graph visualisation of counterplay in Rainbow Six Siege.

![R6 Operator Counters](https://i.imgur.com/8bRZsdb.png)

## Features

* Visualise hard and soft counters for each operator in the game.
* View operator details, counter details and filter the graph based on counter level (hard/soft/minor).
* Drag & interact with the operators.
* Crisp graphics at any zoom level.
* Responsive web design.

## Dependencies
* Uses [neo4dj3](https://github.com/eisman/neo4jd3) for graph visualisation.
* Uses [marcopixel r6-operatoricons](https://marcopixel.eu/r6-operatoricons/) for all the vector operator icons.

## Running

First of all, make sure you have [ruby](https://www.ruby-lang.org/en/downloads/) and sass gem installed. Then, clone the repository, install all dependencies, build and serve the project.

```bash
> gem install sass
> git clone https://github.com/BurkusCat/r6-operator-counters.git
> npm install
> gulp
```

Open `http://localhost:8080` in your favorite browser.

## How to contribute

I am hoping that this project will be a fun place for open source newcomers (like myself). Feel free to take a look at the issues or come up with your own improvements for the project. I am happy to review pull requests and I can answer questions you might have.

Key places to look if you want to update something in this project:
```
Operator SVGs/Images - r6-operator-counters\docs\img\svg\
The main webpage - r6-operator-counters\docs\index.html
Neo4j JSON file with operator data - r6-operator-counters\docs\json\r6OperatorCounters
neo4jd3 enhancements such as styling - r6-operator-counter\src\main
```

## r6counters.com
Any pull requests that get merged into master will trigger a build of the website. This build will get published to AWS and will be hosted at [https://r6counters.com/](https://r6counters.com/) after a day.

## What's coming?

* More filtering
* More views

## Copyright and license

Code and documentation copyright 2018 the author. Code released under the [MIT license](LICENSE). Docs released under [Creative Commons](docs/LICENSE).
