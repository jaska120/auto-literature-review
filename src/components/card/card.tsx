import type { HTMLAttributes } from "react";
import { CircleInfoIcon } from "@/components/icon/circle-info-icon";

interface CardProps extends Pick<HTMLAttributes<HTMLDivElement>, "className"> {
  body: string | React.ReactNode;
}

/**
 * A card component with a gradient border at the bottom.
 */
export function Card({ className, body }: CardProps) {
  let cn =
    "relative block overflow-hidden rounded-lg bg-white border border-gray-100 p-4 shadow-md";
  if (className) cn += ` ${className}`;

  return (
    <div className={cn}>
      <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600" />
      <p className="text-pretty text-sm text-gray-700">
        <CircleInfoIcon className="size-6 mr-4 text-base inline" />
        {body}
      </p>
    </div>
  );
}
