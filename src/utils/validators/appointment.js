import * as Yup from 'yup'

const schema = Yup.object().shape({
  provider_id: Yup.number().required(),
  date: Yup.date().required(),
})

export default schema
