import * as yup from "yup";

export const pdfSchema = yup.object().shape({
  hash: yup.string().required("O hash é obrigatório"),
});
