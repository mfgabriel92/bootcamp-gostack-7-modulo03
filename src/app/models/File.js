import Sequelize, { Model } from 'sequelize'

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        id: Sequelize.NUMBER,
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`
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
      id: this.id,
      // name: this.name,
      // path: this.path,
      url: this.url,
    }
  }
}

export default File
