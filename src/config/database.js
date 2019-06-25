module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  usename: 'postgres',
  password: 'root',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
