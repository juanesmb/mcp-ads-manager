import crypto from "node:crypto";

const defaultBillingContactEmail = "juanesmoncada123@gmail.com";
const defaultBillingSubject = "Activate Jumon subscription";
const defaultBillingBodyTemplate = [
  "Organization: <org_id_or_name>",
  "Admin email: <admin_email>",
  "Notes: <anything_helpful>"
].join("\n");

export type SubscriptionRequiredErrorInput = {
  provider?: string;
  billingContactEmail?: string;
};

type SubscriptionRequiredErrorPayload = {
  code: "SUBSCRIPTION_REQUIRED";
  reason: "MANUAL_BILLING_REQUIRED";
  message: string;
  nextStep: string;
  agentGuidance: string;
  billingProcess: {
    type: "MANUAL_INVOICE";
    description: string;
  };
  contact: {
    email: string;
    subject: string;
    bodyTemplate: string;
  };
  supportId: string;
  provider?: string;
};

export function isUserBlockedFromMcpProviderAccess(
  userId: string,
  blockedUserIdsEnv = process.env.MCP_BLOCKED_USER_IDS
): boolean {
  if (!userId) {
    return false;
  }

  const blockedUserIds = parseBlockedUserIds(blockedUserIdsEnv);
  return blockedUserIds.has(userId);
}

export function buildSubscriptionRequiredError(
  input: SubscriptionRequiredErrorInput = {}
): SubscriptionRequiredErrorPayload {
  const email = resolveBillingContactEmail(input.billingContactEmail);
  const payload: SubscriptionRequiredErrorPayload = {
    code: "SUBSCRIPTION_REQUIRED",
    reason: "MANUAL_BILLING_REQUIRED",
    message:
      "MCP access is currently disabled because this organization does not have an active paid Jumon subscription.",
    nextStep:
      "Have your organization admin email Jumon billing to request activation. Jumon will create the Stripe customer + subscription and send an invoice to your admin. Access is restored after invoice payment is confirmed.",
    agentGuidance: [
      "Explain to the user that MCP access is blocked only for billing reasons.",
      "Tell the user to ask their organization admin to contact billing at the email below.",
      "Tell the admin to include organization identifier and billing contact details.",
      "Explain that Jumon will manually create the Stripe subscription and send an invoice by email.",
      "Explain that MCP access will be re-enabled after payment confirmation."
    ].join(" "),
    billingProcess: {
      type: "MANUAL_INVOICE",
      description:
        "Jumon will create the customer and subscription in Stripe, then send an invoice email to your organization admin."
    },
    contact: {
      email,
      subject: defaultBillingSubject,
      bodyTemplate: defaultBillingBodyTemplate
    },
    supportId: crypto.randomUUID()
  };

  if (input.provider) {
    payload.provider = input.provider;
  }

  return payload;
}

function parseBlockedUserIds(blockedUserIdsEnv: string | undefined): Set<string> {
  if (!blockedUserIdsEnv) {
    return new Set();
  }

  const ids = blockedUserIdsEnv
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set(ids);
}

function resolveBillingContactEmail(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : defaultBillingContactEmail;
}
