import { GardenApp } from "@/components/garden-app";
import {
  SIGN_IN_SEND_FAILED_MESSAGE,
  SIGN_IN_SENT_MESSAGE,
  SIGN_IN_UNAVAILABLE_MESSAGE,
  type AuthGateResult
} from "@/components/auth-gate";

function getAuthResult(auth: string | undefined): AuthGateResult | null {
  if (auth === "sent") {
    return {
      status: "sent",
      message: SIGN_IN_SENT_MESSAGE
    };
  }

  if (auth === "invalid_email") {
    return {
      status: "error",
      message: "Enter a valid email address."
    };
  }

  if (auth === "missing_config") {
    return {
      status: "error",
      message: SIGN_IN_UNAVAILABLE_MESSAGE
    };
  }

  if (auth === "send_failed") {
    return {
      status: "error",
      message: SIGN_IN_SEND_FAILED_MESSAGE
    };
  }

  return null;
}

export default async function MyPropertyPage({
  searchParams
}: {
  searchParams?: Promise<{ auth?: string; zone?: string; bed?: string; plant?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const shouldOpenMemory = Boolean(
    resolvedSearchParams?.zone || resolvedSearchParams?.bed || resolvedSearchParams?.plant
  );

  return <GardenApp authResult={getAuthResult(resolvedSearchParams?.auth)} view={shouldOpenMemory ? "property" : "ask"} />;
}
