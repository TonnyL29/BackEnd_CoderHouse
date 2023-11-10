import messageModel from '../models/message.model.js'

export default  class msnManager {

    static async get(query = {}) {
        const criteria = {};
        if(query.msn_id){
            criteria.user_id = query.msn_id
        }
        const msn = await messageModel.find(criteria);
        return msn;
    }

    static async create(data) {
        const user = await messageModel.create(data);
        console.log('Message creado correctamente');
        return msn;
    }

    static async getById(sid) {
        const msn = await messageModel.findById(sid);
        if(!msn){
            throw new error ('No existe el Message');
        }
        return user;
    }

    // static async updateById(sid, data) {
    //     const msn = await messageModel.findById(sid);
    //     if(!msn){
    //         throw new error ('No existe el msn');
    //     }
    //     const criteria = {msn_id : sid};
    //     const operation = {$set: data};
    //     await messageModel.updateOne(criteria, operation);
    //     console.log('Msn actualizado correctamente');
    // }

    static async deleteById(sid) {
        try {
            const deletedMsn = await prodModel.findByIdAndDelete(sid);
    
            if (!deletedMsn) {
                throw new Error('No existe el mensaje');
            }
    
            console.log('Mensaje eliminado correctamente');
            return deletedMsn;
        } catch (error) {
            throw error;
        }
    }
}