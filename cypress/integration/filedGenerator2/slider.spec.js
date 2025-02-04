describe('Slider In Filed Generator Part 2', () => {
  const fixtureDir = 'filedGenerator2/slider';

  beforeEach(() => {
    cy.initMock(fixtureDir);
  });

  it('Render', () => {
    cy.get('@products').then(products => {
      const { entities } = products.stages[0].groups[0];
      cy.get('.ant-form-item')
        .should('have.length', entities.length)
        .each((item, index) => {
          cy.wrap(item).find('div[role="slider"]');
          cy.wrap(item).should('contain', entities[index].entity.label);
        });
    });
  });

  it('Initial Value', () => {
    cy.get('@application').then(application => {
      const filedsDataValues = Object.values(application.stages[0].data);
      cy.get('div[role="slider"]')
        .should('have.length', 3)
        .each((item, index) => {
          cy.wrap(item).should(
            'have.attr',
            'aria-valuenow',
            filedsDataValues[index],
          );
        });
    });
  });

  it('Action', () => {
    cy.get('.ant-form-item')
      .eq(0)
      .then(item => {
        cy.wrap(item)
          .contains(4)
          .click({ force: true });

        cy.wrap(item)
          .find('div[role="slider"]')
          .should('have.attr', 'aria-valuenow', 4);

        cy.wrap(item)
          .contains(10)
          .click({ force: true });

        cy.wrap(item)
          .find('div[role="slider"]')
          .should('have.attr', 'aria-valuenow', 10);
      });
  });
});
