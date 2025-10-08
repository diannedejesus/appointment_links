import express from 'express'
import * as loginCont from '../controllers/loginCont.js';
import {ensureAuth, ensureGuest} from '../middleware/auth.js';
const router = express.Router()

router.get('/', loginCont.getPage);
router.post('/', loginCont.postLogin);
router.get('/configure', ensureAuth, loginCont.getConfigureCalendar);
router.post('/configure', ensureAuth, loginCont.configureCalendar);

export default router
 