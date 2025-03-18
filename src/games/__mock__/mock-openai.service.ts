export class MockOpenAIGameRulesService {
  private mockGameRules: string[] = [
    'In tag, always be quick and agile to avoid getting tagged.',
    'In chess, think ahead and plan your moves carefully.',
    'In hide and seek, be silent and find the best hiding spot.',
    'In basketball, pass the ball quickly to create scoring opportunities.',
    'In soccer, communicate with your team and play as a unit.',
  ];

  private fixedRule = 'In chess, think ahead and plan your moves carefully.';

  generateGameRule(): string {
    return this.fixedRule;
  }

  getMockGameRules(): string[] {
    return this.mockGameRules;
  }
}
