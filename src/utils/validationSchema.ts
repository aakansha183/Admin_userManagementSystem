// src/utils/validationSchema.ts
import * as Yup from 'yup';

export const loginSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  roleType: Yup.string().oneOf(['admin', 'user']).required('Role type is required'),
});

export const registerSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  roleType: Yup.string().oneOf(['admin', 'user']).required('Role type is required'),
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
});
