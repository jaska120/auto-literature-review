import { forwardRef } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { SetRequired } from "type-fest";

interface TextareaProps
  extends SetRequired<Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">, "id"> {
  label: string;
  helperText?: string;
  error?: boolean;
}

/**
 * @requires `@tailwindcss/forms` plugin
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, helperText, error, ...props },
  ref
) {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-xs font-medium text-gray-700">
        {label}
      </label>

      <textarea
        ref={ref}
        id={id}
        className={`mt-1 w-full rounded-md shadow-md sm:text-sm ${
          error ? "border-red-500" : "border-gray-200"
        }`}
        {...props}
      />

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
