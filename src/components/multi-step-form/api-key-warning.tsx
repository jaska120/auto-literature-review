import { isSuccess, Operation } from "@/utils/operation";
import Link from "next/link";

interface ApiKeyWarningProps {
  service: "Open AI" | "Scopus";
  connection: Operation;
}

export function ApiKeyWarning({ service, connection }: ApiKeyWarningProps) {
  return isSuccess(connection) ? null : (
    <Link href="/configuration" className="text-sm hover:underline text-red-600 hover:text-red-700">
      Check your {service} API key in configuration.
    </Link>
  );
}
