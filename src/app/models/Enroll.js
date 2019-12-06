import Sequelize, { Model } from 'sequelize';

class Enroll extends Model {
  static init(sequelize) {
    // sequelize é a conexão vinda do this.connection dentro de index.js da database
    super.init(
      // os dados não precisam ser reflexo dos dados do banco, o model define somente os dados que podem ser passados no post
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
      },
      {
        sequelize, // passando para o super o segundo parametro que é a conexão
      }
    );
    return this; // sempre retorna o model incicializado aqui dentro
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id' });
  }
}
export default Enroll;
