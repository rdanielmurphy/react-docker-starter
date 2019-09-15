import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
    token: { type: 'String' },
    email: { type: 'String' },
    expires: { type: 'Date' },
    used: { type: 'Boolean' }
});

export default mongoose.model('ForgotPassword', forgotPasswordSchema);
