import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  checkPassword(password) {
    // metodo para checkar usuário como não faz nenhuma função do crud pode ser criado aqui
    // recebendo password
    // fazendo comparação de o password recebido bate com o password_hash
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
