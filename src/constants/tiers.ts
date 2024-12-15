const TierConstraints = {
  FREE: {
    maxSendSize: 2.5 * 1024 * 1024 * 1024, // 2.5 GB in bytes
    maxStorage: 25 * 1024 * 1024 * 1024, // 25 GB in bytes
    minExpiry: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
    maxExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },
  PRO: {
    maxSendSize: 250 * 1024 * 1024 * 1024, // 250 GB in bytes
    maxStorage: 1 * 1024 * 1024 * 1024 * 1024, // 1 TB in bytes
    minExpiry: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
    maxExpiry: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
  },
  PREMIUM: {
    maxSendSize: Number.POSITIVE_INFINITY,
    maxStorage: Number.POSITIVE_INFINITY,
    minExpiry: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
    maxExpiry: 365 * 24 * 60 * 60 * 1000, // 365 days in milliseconds
  },
};

export { TierConstraints };
