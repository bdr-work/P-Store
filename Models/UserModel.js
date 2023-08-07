const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "User Name is required."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "User Email is required."],
    },
    phone: {
      type: String,
      unique: true,
    },
    profileImg: String,
    password: {
      type: String,
      required: [true, "User Password is required."],
      minlength: [6, "Too short password"],
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    otpCode: String,
    otpCodeExpires: Date,
    otpCodeVerified: Boolean,
    resetCodeExpires: Date,
    passwordResetCodeVerified: Boolean,
    role: {
      type: String,
      enum: ["admin", "user", "manager"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
      wishlist: [
          {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
          },
        ],
     addresses:[{
      id:{type:mongoose.Schema.Types.ObjectId,},
      alias: String,
      details: String,
      phone:String,
      city:String,
      postalCode:String,
     }]
  },
  { timestamps: true },
);

//Set Image Url
const setImageURL = (doc) => {
  if (doc.profileImg) {
    const imageURL = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageURL;
  }
};

//Save image of product with the Name
userSchema.post("init", (doc) => {
  setImageURL(doc);
});
//Save image of product with the Name
userSchema.post("save", (doc) => {
  setImageURL(doc);
});

//Here the code for hashing the password When save in the database
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 14);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
