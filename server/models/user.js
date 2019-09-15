import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId: { type: 'String' },
    facebookId: { type: 'String' },
    email: { type: 'String' },
    password: { type: 'String' },
    displayName: { type: 'String' },
    googleJson: { type: 'String' },
    facebookJson: { type: 'String' },
    emailVerified: { type: 'Boolean' },
    confirmationToken: { type: 'String' }
});
userSchema.plugin(findOrCreate);

export default mongoose.model('User', userSchema);
