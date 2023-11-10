import userModel from '../models/user.model.js'

export default  class userManager {

    static async get(query = {}) {
        const criteria = {};
        if(query.user_id){
            criteria.user_id = query.user_id
        }
        const user = await userModel.find(criteria);
        return user;
    }

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
}