const {Schema, model}= require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin", "editor"],
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


userSchema.pre("save", async function(){
   this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password);
}


module.exports = model("User", userSchema);