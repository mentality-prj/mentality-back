export class MockOpenAIService {
  private mockAffirmations: string[] = [
    'You are capable of amazing things.',
    'Believe in yourself and your abilities.',
    'Every day is a fresh start.',
    'You are worthy of love and respect.',
    'Happiness begins with you.',
    'Your potential is limitless.',
    'You are stronger than you think.',
    'Success is within your reach.',
    'You are enough just as you are.',
    'Every challenge is an opportunity to grow.',
  ];

  private fixedText = 'You are enough just as you are.';
  private fixedImageUrl = 'https://picsum.photos/1478/1478';

  generateAffirmationText(): string {
    return this.fixedText;
  }

  generateImage(_prompt: string): string {
    return this.fixedImageUrl;
  }

  getMockAffirmations(): string[] {
    return this.mockAffirmations;
  }
}
