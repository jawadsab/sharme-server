import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg',
    },
    public_id: {
      type: String,
      default: ''
    },
    savedPins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pin',
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.getSignedToken = async function() {
    return jwt.sign({id:this._id},"secret",{expiresIn:"3d"});
}

const userModel = mongoose.model('User', userSchema);
export default userModel;
