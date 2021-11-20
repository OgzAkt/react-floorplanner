import React, { useEffect, useState } from "react";

const TextInput = ({
  validate,
  className,
  placeholder,
  disabled,
  colliderClassName,
  register,
  labelBg,
  ...rest
}) => {
  const [focus, setFocus] = useState(true);

  return (
    <div
      className={
        "relative inline-flex desktop:max-w-7xl laptop:max-w-5xl tablet:max-w-2xl mobile:max-w-sm " +
        colliderClassName
      }
    >
      <input
        className={
          "relative block w-full p-4 text-base font-medium bg-white border-black border-solid text-primary-default border-primary border-default font-manrope focus:outline-none rounded rounded-12 " +
          className
        }
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          if (!e.target.value) setFocus(true);
        }}
        style={{
          border: "1px solid #CCCCCC",
          height: "3.5rem",
        }}
        {...register}
        {...rest}
      />
      <label
        className="absolute h-4 text-base font-normal pointer-events-none font-manrope text-dark-50"
        style={
          focus
            ? {
                top: "-10px",
                fontSize: "14px",
                left: "16px",
                backgroundColor: labelBg ? labelBg : "#ffffff",
                color: "#808080",
              }
            : {
                left: "16px",
                top: "16px",
                transition: "0.2s ease all",
                color: "#808080",
              }
        }
      >
        {placeholder}
      </label>

      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
        {validate === "success" ? (
          <SuccessIcon />
        ) : validate === "warning" ? (
          <WarningIcon />
        ) : validate === "error" ? (
          <ErrorIcon />
        ) : null}
      </div>
    </div>
  );
};

export default TextInput;
