import { Router } from "express";
import userManager from '../dao/userManager.js'
import { hashPassword, validPassword } from '../Utilities/utilities.js'
import passport from "passport";
import prodRouter from './product.router.js'

const router = Router();


const auth = (req, res, next) => {
    console.log("Session Passport: ")
    console.log(req.session.passport)
    if (req.session.passport.user.email && req.session.passport.user.status) {
        next();
    } else {
        res.status(401).send('No tiene permisos para acceder');
    }
};
router.get('/private', auth, (req, res) => {
    const UserName = req.session.passport.user.name;
    const status = req.session.passport.user.status;
    res.render('products',{UserName,  status});

});

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/sessions/github_callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = req.user;
  res.redirect('../private')
})


router.post('/login', passport.authenticate('login', { failureRedirect: '/' }), (req, res) => {
    console.log(req.session)
    req.session.user = req.user.email;
    res.redirect('private')
});
//router.use('products', prodRouter);

router.post('/register', passport.authenticate('register', { failureRedirect: '/' }), (req, res) => {
    if (req.user) {
        res.status(201).json({ message: 'Usuario creado correctamente', statusRegister: true });
    } else {
        res.status(400).json({ message: 'Error en el registro', statusRegister: false });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.json({ message: 'Sesión cerrada correctamente', statusLogout: true });
    });
});

router.get('/', (req, res) => {
    res.render('login');
})

router.get('/recoverPass', (req, res) => {
    res.render('recoverPass');
})

router.post('/recovery', async (req, res) => {
    try {
        const { username, email, newPassword } = req.body;
        const hashedPassword = await hashPassword(newPassword);
        await userManager.updatePassword(username, email, hashedPassword);
        res.json({ message: 'Contraseña actualizada exitosamente', statusrecovery: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la contraseña', statusrecovery: false });
    }
});




export default router;