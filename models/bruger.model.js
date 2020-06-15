const mongoose = require('mongoose')
let bcrypt = require('bcrypt')


const brugerSchema = new mongoose.Schema({
  brugerName: {
    type: String,
    required: true,
    default: "John Doe"
  },
  brugerEmail: {
    type: String,
    required: [true, 'Email is required'],
    trim: true, //fjerner mellemrum før og efter email
    lowercase: true, //gemmer alt i små bogstaver
    index: { unique: true } //Søger for at brugeren ikke findes i forvejen

  },
  brugerPassword: {
    type: String,
    required: [true, 'Password is required!'],
    minlenght: [3, 'Password ned to be longer!']

  }
}, { timestamps: true })

// Verification - cb = callback
brugerSchema.methods.comparePassword = function (indtastetPassword, cb) {
  bcrypt.compare(indtastetPassword, this.brugerPassword, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Krypter pw - når bruger-data gemmes hvis password er ændret/nyt 
brugerSchema.pre('save', async function (next) {

  const user = this;
  // hvis bruger er rettet men password ikke ændret så next() = forlad middleware her
  if (!user.isModified('brugerPassword')) return next();

  //Lav nyt password
  const hashedPassword = await bcrypt.hash(user.brugerPassword, 10)

  //Erstat password med det krypterede password
  user.brugerPassword = hashedPassword

  next()
});


module.exports = mongoose.model('bruger', brugerSchema, 'bruger')