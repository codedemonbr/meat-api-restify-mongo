import * as mongoose from 'mongoose';

export interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        unique: true,
        // required: true
    },
    password: {
        type: String,
        select: false,
        // required: true
        // spoiler: as validações required entram no proximo commit
        // select é uma opção para não mostrar password
    },
});

export const User = mongoose.model<User>('User', userSchema);
