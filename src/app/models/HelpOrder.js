import Sequelize, { Model } from 'sequelize';

class HelpOrder extends Model {
  static init(sequelize) {
    // sequelize é a conexão vinda do this.connection dentro de index.js da database
    super.init(
      // os dados não precisam ser reflexo dos dados do banco, o model define somente os dados que podem ser passados no post
      {
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize, // passando para o super o segundo parametro que é a conexão
      }
    );
    return this; // sempre retorna o model incicializado aqui dentro
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
  }
}
export default HelpOrder;
