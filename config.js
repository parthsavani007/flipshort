import dotenv from 'dotenv';
dotenv.config();


export default {
    PORT: process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb+srv://intrexitx:12345@cluster0.nac9c5q.mongodb.net/?retryWrites=true&w=majority',
   
    };
  

