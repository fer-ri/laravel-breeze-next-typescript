import { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = ({ className, children, ...props }: LabelProps) => (
  <label
    className={`${className} block font-medium text-sm text-gray-700`}
    {...props}
  >
    {children}
  </label>
);

export default Label;
