import { PropsWithChildren } from "react";
import { Loading } from "../loading/loading";

interface FormResultProps {
  loading?: boolean;
}

interface FormProps {
  name: string;
  onSubmit: () => void;
}

export function FormContainer({ children }: PropsWithChildren) {
  return <div className="flex flex-col flex-1 gap-8">{children}</div>;
}

export function FormResult({ children, loading }: PropsWithChildren<FormResultProps>) {
  return <div className="flex-1 basis-0 overflow-y-auto">{loading ? <Loading /> : children}</div>;
}

export function Form({ name, onSubmit, children }: PropsWithChildren<FormProps>) {
  return (
    <form className="sticky bottom-0 w-full flex flex-col gap-4" name={name} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
