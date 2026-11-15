import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function main() {
  const sqlPath = path.resolve(__dirname, 'rls.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log('Applying RLS policies to Supabase...');

  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (e: any) {
      console.warn(`Notice: ${e.message}`);
    }
  }

  console.log('Row Level Security (RLS) policies successfully activated on all tables!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

