import express from 'express'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRouter from './routes/user.route.js'
import adminRouter from './routes/admin.route.js'
import storeRoute from './routes/store.route.js'
import ratingRoute from './routes/rating.route.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5001

connectDB()

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/store', storeRoute)
app.use('/api/rating', ratingRoute)

app.get('/', (req, res) => {
    res.send("Hello")
})

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
    
})