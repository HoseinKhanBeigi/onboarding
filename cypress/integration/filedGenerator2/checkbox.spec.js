describe('Checkbox In Filed Generator Part 2', () => {
  const applicationId = Cypress.env('applicationId');
  const productName = Cypress.env('productName');
  const fixtureDir = 'filedGenerator2/checkbox';

  beforeEach(() => {
    cy.initMock(fixtureDir);
  });

  it('Render', () => {
    cy.get('@products').then(products => {
      const { entities } = products.stages[0].groups[0];
      cy.get('.ant-form-item')
        .should('have.length', entities.length)
        .each((item, index) => {
          cy.wrap(item)
            .find('input')
            .invoke('prop', 'type')
            .should('eq', 'checkbox');

          cy.wrap(item)
            .find('input')
            .invoke('prop', 'name')
            .should('eq', entities[index].entity.name);

          cy.wrap(item).should('contain', entities[index].entity.label);
        });
    });
  });

  it('Initial Value', () => {
    cy.get('@application').then(application => {
      const filedsData = application.stages[0].data;
      for (const key in filedsData) {
        let checkCondition = 'be.checked';
        if (filedsData[key] === false) {
          checkCondition = 'not.be.checked';
        }
        cy.get(`input[name="${key}"]`).should(checkCondition);
      }
    });
  });

  it('Action', () => {
    cy.get('input')
      .eq(0)
      .click({ force: true })
      .should('be.checked')
      .click({ force: true })
      .should('not.be.checked');

    cy.get('input')
      .eq(1)
      .click({ force: true })
      .should('not.be.checked');
  });

  it('Validation', () => {
    cy.server();
    cy.route('PUT', `**/applications/${applicationId}/one`, `@application`);

    cy.get('.ant-form-item').then(items => {
      cy.contains('مرحله بعد').click();

      cy.url().should(
        'include',
        `/onboarding/${productName}/one/${applicationId}`,
      );

      cy.wrap(items)
        .eq(0)
        .find('.ant-form-item-control')
        .should('have.class', 'has-error')
        .find('.ant-form-explain')
        .invoke('text')
        .should('eq', 'این فیلد اجباری است');

      cy.wrap(items)
        .eq(1)
        .find('.ant-form-item-control')
        .should('have.class', 'has-success');

      cy.wrap(items)
        .eq(2)
        .find('.ant-form-item-control')
        .should('have.class', 'has-error')
        .find('.ant-form-explain')
        .invoke('text')
        .should('eq', 'این فیلد اجباری است');

      cy.wrap(items)
        .eq(0)
        .find('input')
        .click({ force: true });

      cy.wrap(items)
        .eq(2)
        .find('input')
        .click({ force: true });

      cy.contains('مرحله بعد')
        .click()
        .wait(1000);

      cy.url().should(
        'include',
        `/onboarding/${productName}/review/${applicationId}`,
      );
    });
  });
});
