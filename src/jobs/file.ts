import { prisma } from "../lib/prisma";
import { removeFile } from "../services/file";

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
    try {
      await removeFile({ key: file.name });

      console.log(`File ${file.name} deleted from S3.`);
    } catch (error) {
      console.error(`Error deleting file ${file.name} from S3:`, error);
    }
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
