const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
 
app.get('/', function (req, res) {
	res.render('index');
});

app.post('/', function (req, res) {
	const { city } = req.body;
	const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.apiKey}`; 
	request(url, function (err, response, body) {
		const jsonBody = JSON.parse(body);
		const tempInFarenheit = jsonBody.main.temp; 
		const tempInCelcius = (5*(tempInFarenheit - 32))/9;
		console.log(tempInCelcius, '***');
    
		const celciusRounded = tempInCelcius.toFixed(2);
		console.log('celciusRounded');

		const maxTempInF = jsonBody.main.temp_max;
		const maxTempInCelcius = (5*(maxTempInF - 32))/9;
		console.log(maxTempInCelcius,'***');
		const maxTempRounded = maxTempInCelcius.toFixed(2);
		console.log(maxTempRounded, 'maxTempRounded');
        
		const minTempInF = jsonBody.main.temp_min;
		const minTempinCelcius = (5*(minTempInF - 32))/9;
		console.log(minTempinCelcius, '***');
		const minTempRounded = minTempinCelcius.toFixed(2);
		console.log(minTempRounded, 'minTempRounded');
		let greeting;
		if (celciusRounded >20) {
			greeting = 'Make sure you have your suncream!'; 
		} else { 
			greeting = ' Make sure you have a jacket!';

		}
		const isHot = (celciusRounded>20);
		res.render('success', { jsonBody, celciusRounded, tempInCelcius, maxTempRounded, minTempRounded, greeting, isHot });
		if(err){    
			res.render('index', {weather: null, error: 'Error, please try again'});
		}
	}); 
	// res.redirect('/success');
});

app.get('/success', function (req, res) {
	res.render('success');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});