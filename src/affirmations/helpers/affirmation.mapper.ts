import { AffirmationEntity } from '../entities/affirmation.entity';
import { Affirmation } from '../schemas/affirmation.schema';

export class AffirmationsMapper {
  static toAffirmationEntity(doc: Affirmation): AffirmationEntity {
    return {
      id: doc._id.toString(),
      translations: doc.translations,
      isPublished: doc.isPublished,
      imageUrl: doc.imageUrl,
      createdAt: doc.createdAt,
    };
  }
}
