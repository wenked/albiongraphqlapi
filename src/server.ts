import express from 'express';

const app = express();

app.get('/', (request, response) => {
	return response.json({ message: 'koe' });
});

app.listen(3333);

console.log('teste');
console.log('ae');
