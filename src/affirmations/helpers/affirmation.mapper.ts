import { AffirmationEntity } from '../entities/affirmation.entity';
import { Affirmation } from '../schemas/affirmation.schema';

// affirmation.mapper for the AffirmationsService class. The AffirmationMapper class contains the following methods:
export class AffirmationsMapper {
  static toAffirmationEntity(affirmation: Affirmation): AffirmationEntity {
    return {
      id: affirmation.id.toString(),
      text: affirmation.text,
      createdAt: affirmation.createdAt,
      imageUrl: affirmation.imageUrl,
      isPublished: affirmation.isPublished,
    };
  }
}
