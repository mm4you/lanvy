// Script to clean up nameVietnamese field in CustomVocab entries
// Run with `ts-node scripts/clean_nameVietnamese.ts`
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanNameVietnamese() {
  const allVocab = await prisma.customVocab.findMany();
  let count = 0;
  for (const vocab of allVocab) {
    if (vocab.nameVietnamese && vocab.category) {
      const catPattern = new RegExp(`^\\s*${vocab.category}\\s*[-:：]?\\s*`, 'i');
      const cleaned = vocab.nameVietnamese.replace(catPattern, '').trim();
      if (cleaned !== vocab.nameVietnamese) {
        await prisma.customVocab.update({
          where: { id: vocab.id },
          data: { nameVietnamese: cleaned },
        });
        count++;
      }
    }
  }
  console.log(`Cleaned ${count} vocab entries.`);
}

cleanNameVietnamese()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
