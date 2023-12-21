import * as yup from "yup";

export const registerSchema = yup.object().shape({
  first_name: yup.string().required("O primeiro nome é obrigatório"),
  last_name: yup.string().required("O sobrenome é obrigatório"),
  username: yup.string().required("O nome de usuário é obrigatório"),
  email: yup
    .string()
    .required("O email é obrigatório")
    .email("Informe um email válido"),
  password: yup.string().required("A senha é obrigatória"),
});
