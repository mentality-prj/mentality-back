import { DiaryEntity } from '../entities/diary.entity';
import { Diary } from '../schemas/diary.schema';

export class DiaryMapper {
  static toDiaryEntity(doc: Diary): DiaryEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      content: doc.content,
      isActive: doc.isActive,
      tags: doc.tags,
      createdAt: doc.createdAt,
      ...(doc.updatedAt && doc.updatedAt !== doc.createdAt
        ? { updatedAt: doc.updatedAt }
        : {}),
    };
  }
}
