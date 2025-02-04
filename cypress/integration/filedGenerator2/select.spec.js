describe('Select In Filed Generator Part 2', () => {
  const applicationId = Cypress.env('applicationId');
  const productName = Cypress.env('productName');
  const fixtureDir = 'filedGenerator2/select';

  beforeEach(() => {
    cy.initMock(fixtureDir);
  });

  it('Render', () => {
    cy.get('@products').then(products => {
      const { entities } = products.stages[0].groups[0];
      cy.get('.ant-form-item')
        .should('have.length', entities.length)
        .each((item, index) => {
          cy.wrap(item).find('div[role="combobox"]');

          cy.wrap(item).should('contain', entities[index].entity.label);
        });
    });
  });

  it('Initial Value', () => {
    cy.get('.ant-form-item')
      .eq(2)
      .find('div.ant-select-selection-selected-value')
      .should('contain', '');

    cy.get('.ant-form-item')
      .eq(3)
      .find('div.ant-select-selection-selected-value')
      .should('contain', 'گزینه اول');
  });

  it('Action', () => {
    cy.get('.ant-form-item').then(items => {
      cy.wrap(items)
        .eq(1)
        .find('.ant-select-selection__rendered')
        .click({ force: true });

      cy.get('p.ant-empty-description').should('contain', 'داده‌ای موجود نیست');

      cy.wrap(items)
        .eq(0)
        .find('div.ant-select-selection-selected-value')
        .should('contain', '');

      cy.wrap(items)
        .eq(0)
        .find('.ant-select-selection__rendered')
        .click({ force: true });

      cy.contains('تهران').click({ force: true });

      cy.wrap(items)
        .eq(0)
        .find('div.ant-select-selection-selected-value')
        .should('contain', 'تهران');

      cy.wrap(items)
        .eq(1)
        .find('.ant-select-selection__rendered')
        .click({ force: true });

      cy.get('p.ant-empty-description').should(
        'not.contain',
        'داده‌ای موجود نیست',
      );

      cy.contains('پاکدشت').click({ force: true });

      cy.wrap(items)
        .eq(1)
        .find('div.ant-select-selection-selected-value')
        .should('contain', 'پاکدشت');
    });
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
        .should('have.class', 'has-success');

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
        .eq(3)
        .find('.ant-form-item-control')
        .should('have.class', 'has-success');

      cy.wrap(items)
        .eq(2)
        .find('.ant-select-selection__rendered')
        .click({ force: true });

      cy.contains('گزینه دوم').click({ force: true });

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
