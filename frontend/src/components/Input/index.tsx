import { InputHTMLAttributes, forwardRef } from "react";

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  isError?: boolean;
}

const Input = forwardRef<HTMLInputElement, IInput>((props, ref) => {
  const { className, isError, ...rest } = props;
  return (
    <input
      ref={ref}
      className={`${className} ${
        isError && "!ring-red-500 !focus:ring-indigo-500"
      } outline-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6 px-2`}
      {...rest}
    />
  );
});

export default Input;
