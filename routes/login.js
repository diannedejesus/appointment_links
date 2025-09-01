import express from 'express' //copied and pasted from microsoft nothing new needs to be changed
import passport from 'passport'
const router = express.Router()
import * as loginCont from '../controllers/loginCont.js';
import {ensureAuth, ensureGuest} from '../middleware/auth.js';

router.get('/', loginCont.getPage);
router.post('/', loginCont.postLogin);
router.get('/configure', loginCont.getConfigureCalendar);
router.post('/configure', loginCont.configureCalendar);

export default router
 