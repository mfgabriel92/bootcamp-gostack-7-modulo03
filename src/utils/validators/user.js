import * as Yup from 'yup'

const newUser = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string()
    .required()
    .min(8),
})

const updateUser = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email(),
  oldPassword: Yup.string().min(8),
  password: Yup.string()
    .min(8)
    .when('oldPassword', (oldPassword, field) =>
      oldPassword ? field.required() : field
    ),
  confirmPassword: Yup.string().when('oldPassword', (password, field) =>
    password ? field.required().oneOf([Yup.ref('password')]) : field
  ),
})

export { newUser, updateUser }
