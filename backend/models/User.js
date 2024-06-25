import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";
import { timeStamp } from "console";
const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING,
    unique:true,
    validate:{
        isEmail:true
    }
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false

  }
  

},
{
    timestamps:false
});



export default User;
