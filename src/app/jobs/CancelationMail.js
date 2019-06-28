import Mail from '../../lib/Mail'

class CancelationMail {
  get key() {
    return 'cancelation_mail'
  }

  async handle({ data }) {
    const { appointment } = data

    await Mail.send({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Scheduled has been canceled',
      text: 'You have a new schedule cancelation',
    })
  }
}
export default new CancelationMail()
