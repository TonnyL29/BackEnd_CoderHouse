import mongoose from 'mongoose';

export const URI = 'mongodb+srv://root:160RfHF8WQoZVLjR@ecommercedb.oh5533b.mongodb.net/ecommerce';

export const init = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Database conected 🚀');
    return true;
  } catch (error) {
    console.log('Ah ocurrido un error al intentar conectarnos a la DB', error.message);
    return false;
  }
}