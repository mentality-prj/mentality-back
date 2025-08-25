export class MoodRecordEntity {
  id: string;
  userId: string;
  createdAt: Date;
  moodLevel: number;
  description?: string;
  tags?: string[];
  stressLevel?: number;
  active: boolean;
}
