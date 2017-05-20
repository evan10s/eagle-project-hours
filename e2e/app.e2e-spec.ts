import { EagleProjectHoursPage } from './app.po';

describe('eagle-project-hours App', () => {
  let page: EagleProjectHoursPage;

  beforeEach(() => {
    page = new EagleProjectHoursPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
