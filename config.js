import dotenv from 'dotenv';
dotenv.config();


export default {
    PORT: process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb+srv://intrexitx:12345@cluster0.nac9c5q.mongodb.net/?retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || 'somethingssecret',
    R_KeyId:process.env.R_KeyId || 'rzp_test_c5z6eRGaOgyPLd',
    RAZOR_PAY_KEY_SECRET:process.env.RAZOR_PAY_KEY_SECRET || 'vRzzCxaeJ2ktBLOJobk0cqpN'
    };
  

