import { TipEntity } from '../entities/tip.entity';
import { Tip } from '../schemas/tip.schema';

export class TipsMapper {
  static toTipEntity(doc: Tip): TipEntity {
    return {
      id: doc._id.toString(),
      isPublished: doc.isPublished,
      translations: doc.translations,
      createdAt: doc.createdAt,
      ...(doc.updatedAt && doc.updatedAt !== doc.createdAt
        ? { updatedAt: doc.updatedAt }
        : {}),
    };
  }
}
