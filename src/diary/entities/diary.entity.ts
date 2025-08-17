export class DiaryEntity {
  id: string;
  userId: string;
  content: string;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
}
