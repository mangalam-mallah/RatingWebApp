import express from 'express'
import {addOrUpdateRating, getStoreRatings, getAverageRating} from '../controllers/rating.controller.js'

const router = express.Router()


router.post("/", addOrUpdateRating);

router.get("/:storeId", getStoreRatings);

router.get("/:storeId/average", getAverageRating);

export default router