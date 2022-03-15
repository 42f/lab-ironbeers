const { response } = require('express');
const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.use(
  require('connect-livereload')({
    port: 3001,
  })
)
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', async (req, res) => {
  try {
    const beersDataFromApi = await punkAPI.getBeers();
    if (beersDataFromApi) {
      const data = {
        beers: beersDataFromApi
      }
      res.render('beers', data);
    }
  } catch (err) {
    // render an error page ?
    console.log(err)
  }
});

app.get('/random-beer', async (req, res) => {
  try {
    const randomBeer = await punkAPI.getRandom();
    if (randomBeer && randomBeer.length) {
      const data = {
        beer: randomBeer[0]
      }
      res.render('random-beer', data);
    }
  } catch (error) {
    // render an error page ?
    console.log(err)
  }
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
