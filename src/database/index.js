import Sequelize from 'sequelize';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enroll from '../app/models/Enroll';
import Checkin from '../app/models/Checkin';
import HelpOrder from '../app/models/HelpOrder';
import databaseConfig from '../config/database';

const models = [User, Student, Plan, Enroll, Checkin, HelpOrder];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // passando a conexão para o metodo init dentro do model

    models
      .map(model => model.init(this.connection)) // percorrendo o array models chamando o init de cada model passando a conexão
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
