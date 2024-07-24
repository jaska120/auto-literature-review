type ButtonVariant = "primary" | "destructive";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
}

function getClassName(
  variant: ButtonVariant,
  disabled: boolean,
  loading: boolean,
  fullWidth: boolean
) {
  let className =
    "inline-flex items-center justify-center rounded border px-12 py-3 text-sm font-medium text-white focus:outline-none focus:ring";

  if (fullWidth) {
    className += " w-full";
  }

  if (loading || disabled) {
    className += " cursor-not-allowed";
  }

  if (disabled) {
    switch (variant) {
      case "primary":
        className += " border-indigo-300 bg-indigo-300 opacity-70";
        break;
      case "destructive":
        className += " border-red-300 bg-red-300 opacity-70";
        break;
      default:
        className += variant satisfies never;
    }
  } else {
    switch (variant) {
      case "primary":
        className += " border-indigo-600 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-700";
        break;
      case "destructive":
        className += " border-red-600 bg-red-600 hover:bg-red-700 active:bg-red-700";
        break;
      default:
        className += variant satisfies never;
    }
  }

  return className;
}

export function Button({ variant, fullWidth, loading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={getClassName(variant, disabled || false, loading || false, fullWidth || false)}
      type="button"
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
