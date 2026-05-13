import express, { json } from 'express';
import cors from 'cors';
import { cars } from './schema.js';
import { db } from './db.js';
import { eq } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    
    console.log(`${timestamp} - ${req.method} ${req.url}`);
    
    next();
});

app.use(cors());
app.use(json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/cars', async (req, res) => {
  const allCars = await db.select().from(cars);
  res.send(allCars);
});

app.get('/cars/:id', (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send('Car not found');
  res.send(car);
});

app.post('/cars', async (req, res) => {
  const { make, model, year, price } = req.body;
  
    if(!make || !model || !year) {
        return res.status(400).send('Make, model, and year are required');
    }

  const [newCar] = await db.insert(cars).values({ make, model, year, price }).returning();
  

  res.status(201).send(newCar);
});

app.patch('/cars/:id', async (req, res) => {

    if(!req.params.id){
      throw new Error("The value for id must be present")
    }

    const car = await db.select().from(cars).where(eq(cars.id,req.params.id))

    if(!car) return res.status(404).send('Car not found');

    const { make, model, year } = req.body;

    const updatedCar = await db.update(cars)
    .set({
      make,
      model, 
      year
    })
    .where(
      eq(cars.id,req.params.id)
    )
    .returning();

    res.send(updatedCar);
});

app.delete('/cars/:id', (req, res) => {
    // const carIndex = cars.findIndex(c => c.id == req.params.id);
    // if(carIndex === -1) return res.status(404).send('Car not found');

    // const deletedCar = cars.splice(carIndex, 1);
    // res.send(deletedCar[0]);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});