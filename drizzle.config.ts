import 'dotenv/config';
import { Config } from 'drizzle-kit';

export default ({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://user:password@localhost:5433/pubquiz",
  },
});