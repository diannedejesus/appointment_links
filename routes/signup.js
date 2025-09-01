import express from 'express'
const router = express.Router()
import * as signCont from '../controllers/signCont.js';

router.get('/', signCont.getPage);
router.post('/', signCont.postUser);
router.get('/logout', signCont.logout);

export default router
