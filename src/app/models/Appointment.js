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
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'provider' })
  }

  toJSON() {
    return {
      provider_id: this.provider_id,
      date: this.date,
      canceled_at: this.canceled_at,
    }
  }
}

export default Appointment
