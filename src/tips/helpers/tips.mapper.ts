import { TipEntity } from '../entities/tip.entity';
import { Tip } from '../schemas/tip.schema';

export class TipsMapper {
  static toTipEntity(tip: Tip): TipEntity {
    return {
      id: tip._id.toString(),
      isPublished: tip.isPublished,
      translations: tip.translations,
      createdAt: tip.createdAt,
      ...(tip.updatedAt && tip.updatedAt !== tip.createdAt
        ? { updatedAt: tip.updatedAt }
        : {}),
    };
  }
}
