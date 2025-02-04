describe('Select In Filed Generator Part 2', () => {
  const applicationId = Cypress.env('applicationId');
  const productName = Cypress.env('productName');
  const fixtureDir = 'selectStage';
  const startStage = 'selecting';

  beforeEach(() => {
    cy.initMock(fixtureDir, startStage);
  });

  it('Render correct', () => {
    cy.get('@products').then(products => {
      const { stages } = products;
      cy.get('.ant-form-item')
        .should('have.length', stages.length)
        .each((item, index) => {
          // console.log(item, stages, '11111111');
          // cy.wrap(item).find('div[role="combobox"]');

          cy.wrap(item).should('contain', stages[index].label);
        });
    });
  });

  it('Render button conditional', () => {
    cy.get('@application').then(application => {
      const { stages } = application;
      cy.get('.ant-form-item').each((item, index) => {
        if (stages[index].state === 'EMPTY') {
          cy.wrap(item).should('contain', 'تعیین');
        } else if (stages[index].state === 'FILLED') {
          cy.wrap(item).should('contain', 'ویرایش');
        } else if (stages[index].state === 'LOCKED') {
          cy.wrap(item).should('contain', 'تایید شده');
        }
      });
    });
  });

  it('change step work', () => {
    cy.get('.ant-form-item')
      .contains('تعیین')
      .click()
      .url()
      .should('include', `/onboarding/${productName}/one/${applicationId}`);
  });
});
