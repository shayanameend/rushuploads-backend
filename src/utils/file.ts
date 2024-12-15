import type { Tier } from "@prisma/client";

import { TierConstraints } from "../constants/tiers";
import { BadResponse } from "../lib/error";

function validateFileConstraints(
  userTier: Tier,
  totalFileSize: number,
  expiresInMs: number,
  remainingStorage: number,
) {
  const tierConstraints = TierConstraints[userTier];

  if (totalFileSize > tierConstraints.maxSendSize) {
    throw new BadResponse(
      `File size limit exceeded! Max allowed is ${
        tierConstraints.maxSendSize / (1024 * 1024 * 1024)
      } GB for your tier.`,
    );
  }

  if (remainingStorage < totalFileSize) {
    throw new BadResponse(
      `Not enough storage! You have ${
        remainingStorage / (1024 * 1024 * 1024)
      } GB remaining.`,
    );
  }

  if (
    expiresInMs < tierConstraints.minExpiry ||
    expiresInMs > tierConstraints.maxExpiry
  ) {
    throw new BadResponse(
      `Expiry must be between ${
        tierConstraints.minExpiry / (24 * 60 * 60 * 1000)
      } and ${
        tierConstraints.maxExpiry / (24 * 60 * 60 * 1000)
      } days for your tier.`,
    );
  }
}

export { validateFileConstraints };
