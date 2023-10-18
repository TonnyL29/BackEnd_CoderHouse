import { Router } from 'express';

const router = Router();

router.get('/realtimeproducts',(req, res)=>{
    res.render('layouts/home');
})



export default router;