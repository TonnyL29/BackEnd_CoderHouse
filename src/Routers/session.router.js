import { Router } from "express";
import userManager from '../dao/userManager.js'

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios' });
        }
        const user = await userManager.authenticate(username, password);
        req.session.user = user;
        req.session.status = user.status;
        res.json({ message: 'Inicio de sesión exitoso', user, statusLogin: true });
    } catch (error) {
        res.status(401).json({ error: 'Credenciales incorrectas', statusLogin: false });
    }
});

const auth = (req, res, next)=>{
    if(req.session.user && req.session.status){
        if(req.session.status != 'block' ){
            next();
        }
    }else {
        res.status(401).send('no tiene permisos para acceder')
    }
}

router.get ('/private', auth, (req, res)=>{
    const UserName = req.session.user.name;
    const status = req.session.user.status;
    res.render('products', { UserName, status});
})

router.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        if (!userData.username || !userData.password || !userData.email || !userData.name || !userData.lastname) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const user = await userManager.create(userData);
        res.json({ message: 'Usuario creado correctamente', user, statusRegister: true});
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario', statusRegister: false });
    }
});



router.get('/logout', (req, res) => {
    // Destruir la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.json({ message: 'Sesión cerrada correctamente', statusLogout: true });
    });
});

router.get('/', (req, res) =>{
    res.render('login');
})

export default router;