import express from 'express'
import {signup, login, getUserProfile, updateUserProfile, updatePassword} from '../controllers/user.controller.js'
import authenticate from '../middlewares/authenticate.middleware.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/:id", authenticate, getUserProfile)
router.put("/:id",authenticate, updateUserProfile)
router.put("/:id/password", authenticate, updatePassword)

export default router
