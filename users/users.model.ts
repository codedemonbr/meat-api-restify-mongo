import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        select: false,
        // select é uma opção para não mostrar password
    },
});

export const User = mongoose.model('User', userSchema);
