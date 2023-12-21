import React from "react";

interface IFormControl {
  label: string;
  isRequired?: boolean;
  isError?: boolean;
  htmlFor?: string;
  errorMessage?: string;
  children: React.ReactNode;
  classNameLabel?: string;
}

const FormControl = ({
  label,
  htmlFor,
  isRequired = true,
  isError,
  errorMessage,
  classNameLabel,
  children,
}: IFormControl) => {
  return (
    <div className={`${isError ? "!mb-1" : "!mb-5"} !mt-0`}>
      <label
        htmlFor={htmlFor}
        className={`${classNameLabel} block text-sm font-medium leading-6 text-gray-900`}
      >
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </label>
      {children}
      {isError && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
    </div>
  );
};

export default FormControl;
