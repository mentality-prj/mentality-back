import { MoodRecordEntity } from '../entities/mood-record.entity';
import { MoodRecord } from '../schemas/mood-record.schema';

export class MoodRecordMapper {
  static toMoodRecordEntity(doc: MoodRecord): MoodRecordEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      createdAt: doc.createdAt,
      moodLevel: doc.moodLevel,
      description: doc.description,
      tags: doc.tags,
      stressLevel: doc.stressLevel,
      active: doc.active,
    };
  }
}
