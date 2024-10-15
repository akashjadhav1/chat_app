
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true,unique: true }, 
  password: { type: String, required: true },
  pic: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
},
{timestamps: true}
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        console.log(`Comparing: ${enteredPassword} with ${this.password} - Match: ${isMatch}`);
        return isMatch;
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};


userSchema.pre('save',async function (next){
  if(!this.isModified("password")){
    return next();
  }

  const salt = await bcrypt.genSalt(10)
  this.password  = await bcrypt.hash(this.password,salt)
})

const User = mongoose.model("User",userSchema);

module.exports = User;