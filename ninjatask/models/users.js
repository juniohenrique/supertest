import bcrypt from "bcrypt";

module.exports = (sequelize, DataType) => {
  const Users = sequelize.define("Users", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataType.STRING,
      unique: {
        args: true,
        msg: 'Oops. Looks like you already have an account with this email address.',
        fields: [sequelize.fn('lower', sequelize.col('email'))]
      },
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: {
          args: true,
          msg: 'Oops. The email you entered is invalid.'
        }
      }
    }
  }, {
      hooks: {
        beforeCreate: user => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
      classMethods: {
        associate: models => {
          Users.hasMany(models.Tasks);
        },
        isPassword: (encodedPassword, password) => {
          return bcrypt.compareSync(password, encodedPassword);
        }
      }
    });
  return Users;
};
