import mongoose from 'mongoose';

export const init = async () => {
  try {
    const URL = 'mongodb+srv://root:160RfHF8WQoZVLjR@ecommercedb.oh5533b.mongodb.net/ecommerce';
    await mongoose.connect(URL);
    console.log('Database conected 🚀');
  } catch (error) {
    console.log('Ah ocurrido un error al intentar conectarnos a la DB', error.message);
  }
}