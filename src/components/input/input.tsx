import { forwardRef } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { SetRequired } from "type-fest";
import { CircleCheckIcon } from "./circle-check-icon";
import { CircleXIcon } from "./circle-x-icon";

type InputIcon = "check" | "x";

const ICON_MAP: Record<InputIcon, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  check: CircleCheckIcon,
  x: CircleXIcon,
};

interface InputProps
  extends SetRequired<Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">, "id"> {
  label: string;
  helperText?: string;
  error?: boolean;
  icon?: InputIcon;
}

/**
 * @requires `@tailwindcss/forms` plugin
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, helperText, error, icon, ...props },
  ref
) {
  const Icon = icon ? ICON_MAP[icon] : null;

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-xs font-medium text-gray-700">
        {label}
      </label>

      <input
        ref={ref}
        id={id}
        className={`mt-1 w-full rounded-md shadow-sm sm:text-sm ${
          error ? "border-red-500" : "border-gray-200"
        }`}
        {...props}
      />

      {Icon && (
        <span
          className={`pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500 ${helperText ? "-mt-1" : "mt-5"}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      )}

      {helperText && (
        <p
          className={`mt-2 text-xs ${error ? "text-red-500" : "text-gray-500"}`}
          aria-live="polite"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});
