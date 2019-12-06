// credencias para acessar base de dados
// aqui também temos que utilizar a sintaxe do commons js pois o sequelize cli não suporta o import export default
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',
  define: {
    timestamps: true,
    underscored: true, // garante que a padronização de tabelas e colunas com _underscore_ que não é o camelCase
    undersocredAll: true, // para o nome das colunas e relacionamentos
  },
};
