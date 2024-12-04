import { NewTagEntity, TagEntity } from './tag.entity';

describe('TagEntity', () => {
  it('should create a new TagEntity', () => {
    const tag: TagEntity = new TagEntity();
    tag.id = '648a52d9fc13ae44e8000001';
    tag.name = 'Cleaning';
    tag.createdAt = new Date('2024-11-19T14:35:30.742Z');
    tag.updatedAt = new Date('2024-11-20T14:35:30.742Z');

    expect(tag).toBeDefined();
    expect(tag.id).toBe('648a52d9fc13ae44e8000001');
    expect(tag.name).toBe('Cleaning');
    expect(tag.createdAt).toEqual(new Date('2024-11-19T14:35:30.742Z'));
    expect(tag.updatedAt).toEqual(new Date('2024-11-20T14:35:30.742Z'));
  });
});

describe('NewTagEntity', () => {
  it('should create a new NewTagEntity', () => {
    const newTag: NewTagEntity = new NewTagEntity();
    newTag.id = '648a52d9fc13ae44e8000001';
    newTag.name = 'Cleaning';
    newTag.createdAt = new Date('2024-11-19T14:35:30.742Z');

    expect(newTag).toBeDefined();
    expect(newTag.id).toBe('648a52d9fc13ae44e8000001');
    expect(newTag.name).toBe('Cleaning');
    expect(newTag.createdAt).toEqual(new Date('2024-11-19T14:35:30.742Z'));
  });
});
