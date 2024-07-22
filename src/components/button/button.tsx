type ButtonVariant = "primary" | "destructive";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant: ButtonVariant;
  loading?: boolean;
}

function getClassName(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline";
    case "destructive":
      return "w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600";
    default:
      return variant satisfies never;
  }
}

export function Button({ variant, loading, children, ...props }: ButtonProps) {
  return (
    <button className={getClassName(variant)} type="button" {...props}>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
