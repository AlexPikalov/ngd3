import { Ngd3Page } from './app.po';

describe('ngd3 App', () => {
  let page: Ngd3Page;

  beforeEach(() => {
    page = new Ngd3Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
