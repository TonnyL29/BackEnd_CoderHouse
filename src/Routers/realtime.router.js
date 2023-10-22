import express from 'express';

const router = express.Router();

router.get('/realtimeproducts', (req, res) => {
    res.render('layouts/home');
});

export default router;