import express, {Express, Request, Response} from 'express';
import connectToMongo from './database/MongoDB/mongodb';

const userRoutes = require('./routes/UserRoutes/userRoute')
const dbRoutes = require('./routes/UserRoutes/dbuserRoute')

const app= express();
app.use(express.json())

const port = 5000;


app.post('/createUser',userRoutes);
app.post('/login',userRoutes);
app.post('/adddbUser', dbRoutes);

(async () => {
    // Connect to MongoDB before starting the server
    await connectToMongo();
  
    // ... rest of your application code
  
    app.listen(3000, () => console.log('Server listening on port 3000'));
  })();