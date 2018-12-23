# R6 Operator Counters

A graph visualisation of counterplay in Rainbow Six Siege.

![R6 Opeartor Counters](https://i.imgur.com/8bRZsdb.png)

## Features

* Visualise hard and soft counters for each operator in the game.
* Drag & interact with the operators and zoom in indefinitely.

## Dependencies
* Uses [neo4dj3](https://github.com/eisman/neo4jd3) for graph visualisation.
* Uses [marcopixel r6-operatoricons](https://marcopixel.eu/r6-operatoricons/) for all the vector operator icons.

## Running

First of all, make sure you have ruby and sass gem installed. Then, clone the repository, install all dependencies, build and serve the project.

```bash
> gem install sass
> git clone https://github.com/eisman/neo4jd3.git
> npm install
> gulp
```

Open `http://localhost:8080` in your favorite browser.

## How to contribute

I am hoping that this project will be a fun place for open source newcomers (like myself). Feel free to take a look at the issues or come up with your own improvements for the project. I am happy to review pull requests and I can answer questions you might have.

Key places to update in this project:
```
Operator SVGs/Images - r6-operator-counters\docs\img\svg\
The main webpage - r6-operator-counters\docs\index.html
Neo4j JSON file with operator data - r6-operator-counters\docs\json\r6OperatorCounters
neo4jd3 enhancements such as styling - r6-operator-counter\src\main
```

## What's coming?

* Filtering

## Copyright and license

Code and documentation copyright 2018 the author. Code released under the [MIT license](LICENSE). Docs released under [Creative Commons](docs/LICENSE).
