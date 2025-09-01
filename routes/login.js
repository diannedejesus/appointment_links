import express from 'express'
import * as loginCont from '../controllers/loginCont.js';
//import {ensureAuth, ensureGuest} from '../middleware/auth.js';
const router = express.Router()

router.get('/', loginCont.getPage);
router.post('/', loginCont.postLogin);
router.get('/configure', loginCont.getConfigureCalendar);
router.post('/configure', loginCont.configureCalendar);

export default router
 