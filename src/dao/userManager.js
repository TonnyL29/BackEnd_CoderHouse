import userModel from '../models/user.model.js'
import { validPassword } from '../Utilities/utilities.js';

export default  class userManager {
    static async create(data) {
        const user = await userModel.create(data);
        console.log('Usuario creado correctamente');
        return user;
    }

    static async getById(sid) {
        const user = await userModel.findById(sid);
        if(!user){
            throw new error ('No existe el usuario');
        }
        return user;
    }

    static async updateById(sid, data) {
        const user = await userModel.findById(sid);
        if(!user){
            throw new error ('No existe el usuario');
        }
        const criteria = {user_id : sid};
        const operation = {$set: data};
        await userModel.updateOne(criteria, operation);
        console.log('Usuario actualizado correctamente');
    }

    static async deleteById(sid) {
        try {
            const deleteduser = await prodModel.findByIdAndDelete(sid);
    
            if (!deleteduser) {
                throw new Error('No existe el Usuario');
            }
    
            console.log('Usuario eliminado correctamente');
            return deleteduser;
        } catch (error) {
            throw error;
        }
    }
    static async authenticate(usernameOrEmail, password) {
        if (!usernameOrEmail || !password) {
          throw new Error('Nombre de usuario o correo electrónico y contraseña son obligatorios');
        }
    
        // Buscar al usuario por nombre de usuario o correo electrónico
        const user = await userModel.findOne({
          $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
    
        if (!user || !validPassword(password, user.password)) {
          throw new Error('Credenciales incorrectas');
        }
    
        console.log('Usuario autenticado correctamente');
    
        const { _id, username, name, lastname, email, status } = user;
        return { _id, username, name, lastname, email, status };
      }
    
    
      static async updatePassword(username, email, newPassword) {
        const user = await userModel.findOne({
            $or: [{ username: username }, { email: email }],
        });
    
        if (!user) {
            throw new Error('No existe el usuario');
        }
        
        const criteria = { _id: user._id };
        const operation = { $set: { password: newPassword } };
    
        await userModel.updateOne(criteria, operation);
        console.log('Contraseña actualizada correctamente');
    }
}