import express from 'express'
import * as signCont from '../controllers/signCont.js';
const router = express.Router()

router.get('/', signCont.getPage);
router.post('/', signCont.postUser);
router.get('/logout', signCont.logout);

export default router
