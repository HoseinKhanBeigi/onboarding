describe('GroupRenderer Component', () => {
  const fixtureDir = 'groupRenderer';

  beforeEach(() => {
    cy.initMock(fixtureDir);
  });

  it('Render Groups (Check Items, Hidden Entities, Description)', () => {
    cy.get('@products').then(products => {
      const { groups } = products.stages[0];
      groups.map(group => {
        const setOfHiddenEntities = group.entities.filter(
          item => item.entity.hidden !== true,
        );

        if (setOfHiddenEntities.length > 0) {
          cy.get(`div[data-cy="${group.name}"]`).then(groupBox => {
            cy.wrap(groupBox)
              .find('[data-cy="title"]')
              .should('contain', group.label);

            if (group.descriptions.length > 0) {
              cy.wrap(groupBox)
                .find('[data-cy="description"]')
                .each((item, index) => {
                  cy.wrap(item).should('contain', group.descriptions[index]);
                });
            }
          });
        }
      });
    });
  });
});
