describe('EntityRenderer Component', () => {
  const fixtureDir = 'entityRenderer';

  beforeEach(() => {
    cy.initMock(fixtureDir);
  });

  it('Render Screen', () => {
    cy.get('[data-cy="field-box"]').should('have.length', 2);
    cy.get('[data-cy="field-view"]').should('have.length', 1);
  });
});
