import express from 'express';

const router = express.Router();

router.get('/realtimeproducts', (req, res) => {
    res.render('home');
});

export default router;