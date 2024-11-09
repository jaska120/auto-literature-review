import { PropsWithChildren } from "react";
import { CircleInfoIcon } from "../icon/circle-info-icon";

export function Tooltip({ children }: PropsWithChildren) {
  return (
    <div className="group flex relative">
      <CircleInfoIcon className="w-4 h-4" />
      <span className="group-hover:opacity-100 transition-opacity p-4 bg-gray-600 text-sm text-gray-100 rounded-md absolute left-1/2 -translate-x-1/2 translate-y-6 opacity-0">
        {children}
      </span>
    </div>
  );
}
