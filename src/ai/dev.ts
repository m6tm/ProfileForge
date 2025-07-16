import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-profile-updates.ts';
import '@/ai/flows/sensitive-data-flagging.ts';
import '@/ai/flows/profile-summary.ts';