import Sequelize, { Model } from 'sequelize'

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        provider_id: Sequelize.INTEGER,
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' })
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      provider: this.provider,
      user: this.user,
    }
  }
}

export default Appointment
