import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "./index";

interface UserAttributes {
  id?: number;
  email: string;
  password: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});
