const db = require('../db/db');

var userSchema = new db.Schema({
    email: String,
    password: String,
    uniqueToken: String,
    expireToken: Date
});

userSchema.index({ email: 1}, { unique: true, dropDups: true });
userSchema.index({ uniqueToken: 1}, { unique: true, dropDups: true });
userSchema.index({ email: 1, password: 1 }, { unique: true, dropDups: true });

module.exports = db.model('User', userSchema);;

// const Cat = db.model('User', userSchema);

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));