import { TagEntity } from './entities/tag.entity';
import { Tag } from './schemas/tag.schema';

export class TagsMapper {
  static toTagEntity(tag: Tag): TagEntity {
    return {
      id: tag._id.toString(),
      name: tag.name,
      createdAt: tag.createdAt,
      ...(tag.updatedAt && tag.updatedAt !== tag.createdAt
        ? { updatedAt: tag.updatedAt }
        : {}),
    };
  }
}
