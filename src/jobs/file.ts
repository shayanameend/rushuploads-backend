import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { env } from "../lib/env";
import { prisma } from "../lib/prisma";
import { s3Client } from "../lib/s3";

async function deleteFileFromS3(fileKey: string) {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: fileKey,
  });

  try {
    await s3Client.send(deleteCommand);
    console.log(`File ${fileKey} deleted from S3.`);
  } catch (error) {
    console.error(`Error deleting file ${fileKey} from S3:`, error);
  }
}

async function cleanupExpiredFiles() {
  const now = new Date();

  const expiredFiles = await prisma.file.findMany({
    where: {
      expiredAt: {
        lte: now,
      },
    },
  });

  for (const file of expiredFiles) {
    await deleteFileFromS3(file.name);
  }

  await prisma.file.updateMany({
    where: {
      id: {
        in: expiredFiles.map((file) => file.id),
      },
    },
    data: {
      isExpired: true,
    },
  });

  console.log(`${expiredFiles.length} expired files cleaned up.`);
}

export { cleanupExpiredFiles };
