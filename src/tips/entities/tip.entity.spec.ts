import { NewTipEntity, TipEntity } from './tip.entity';

describe('TipEntity', () => {
  it('should create a new TipEntity', () => {
    const tip: TipEntity = new TipEntity();
    tip.id = '648a52d9fc13ae44e8000001';
    tip.isPublished = true;
    tip.content = {
      en: 'Cleaning',
      uk: 'Прибирання',
      pl: 'Sprzątanie',
    };
    tip.createdAt = new Date('2024-11-19T14:35:30.742Z');
    tip.updatedAt = new Date('2024-11-20T14:35:30.742Z');

    expect(tip).toBeDefined();
    expect(tip.id).toBe('648a52d9fc13ae44e8000001');
    expect(tip.isPublished).toBe(true);
    expect(tip.content).toEqual({
      en: 'Cleaning',
      uk: 'Прибирання',
      pl: 'Sprzątanie',
    });
    expect(tip.createdAt).toEqual(new Date('2024-11-19T14:35:30.742Z'));
    expect(tip.updatedAt).toEqual(new Date('2024-11-20T14:35:30.742Z'));
  });
});

describe('NewTipEntity', () => {
  it('should create a new NewTipEntity', () => {
    const newTip: NewTipEntity = new NewTipEntity();
    newTip.id = '648a52d9fc13ae44e8000001';
    newTip.isPublished = false;
    newTip.content = {
      en: 'Cleaning',
      uk: 'Прибирання',
      pl: 'Sprzątanie',
    };
    newTip.createdAt = new Date('2024-11-19T14:35:30.742Z');

    expect(newTip).toBeDefined();
    expect(newTip.id).toBe('648a52d9fc13ae44e8000001');
    expect(newTip.isPublished).toBe(false);
    expect(newTip.content).toEqual({
      en: 'Cleaning',
      uk: 'Прибирання',
      pl: 'Sprzątanie',
    });
    expect(newTip.createdAt).toEqual(new Date('2024-11-19T14:35:30.742Z'));
  });
});
