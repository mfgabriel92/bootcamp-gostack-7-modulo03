import Sequelize, { Model } from 'sequelize'

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.BASE_URL}/files/${this.name}`
          },
        },
      },
      {
        sequelize,
      }
    )

    return this
  }

  toJSON() {
    return {
      name: this.name,
      url: this.url,
    }
  }
}

export default File
