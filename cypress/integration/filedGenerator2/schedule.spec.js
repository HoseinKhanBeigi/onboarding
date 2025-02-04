describe('Schedule In Filed Generator Part 2', () => {
  const applicationId = Cypress.env('applicationId');
  const productName = Cypress.env('productName');
  const fixtureDir = 'filedGenerator2/schedule';
  const defualtBgColor = 'rgb(255, 255, 255)';
  const activeBgColor = 'rgb(245, 245, 245)';

  beforeEach(() => {
    cy.initMock(fixtureDir);
  });

  it('Render', () => {
    cy.get('@products').then(products => {
      const { entities } = products.stages[0].groups[0];
      cy.get('.ant-form-item')
        .should('have.length', entities.length)
        .then(items => {
          cy.wrap(items)
            .eq(0)
            .find('td')
            .should('have.length', 3)
            .and('contain', 'دوشنبه 29 دی')
            .and('contain', '16 الی 23')
            .and('contain', '16 الی 19');

          cy.wrap(items)
            .eq(1)
            .find('td')
            .should('have.length', 6)
            .and('contain', 'شنبه 04 بهمن')
            .and('contain', 'پنج‌شنبه 25 دی')
            .and('contain', 'جمعه 26 دی')
            .and('contain', '07 الی 11')
            .and('contain', '24 الی 04')
            .and('contain', '04 الی 23');

          cy.wrap(items)
            .eq(2)
            .find('td')
            .should('have.length', 5)
            .and('contain', 'شنبه 27 دی')
            .and('contain', 'دوشنبه 29 دی')
            .and('contain', '11 الی 12')
            .and('contain', '08 الی 12')
            .and('contain', '16 الی 19');

          cy.wrap(items)
            .eq(3)
            .find('td')
            .should('have.length', 2)
            .and('contain', 'دوشنبه 22 دی')
            .and('contain', '17 الی 21');

          items.map((index, item) => {
            cy.wrap(item)
              .find('table.schedule')
              .should('have.class', entities[index].entity.name);

            cy.wrap(item).should('contain', entities[index].entity.label);
          });
        });
    });
  });

  it('Initial Value', () => {
    cy.get('.ant-form-item').then(items => {
      cy.wrap(items)
        .eq(0)
        .find(`td[data-key="1"]`)
        .should('have.css', 'background-color', activeBgColor);

      cy.wrap(items)
        .eq(0)
        .find(`td[data-key="2"]`)
        .should('have.css', 'background-color', defualtBgColor);
    });
  });

  it('Action', () => {
    cy.get('.ant-form-item').then(items => {
      cy.wrap(items)
        .eq(0)
        .find(`td[data-key="2"]`)
        .click({ force: true })
        .should('have.css', 'background-color', activeBgColor)
        .parents('table')
        .find(`td[data-key="1"]`)
        .should('have.css', 'background-color', defualtBgColor);

      cy.wrap(items)
        .eq(1)
        .find(`td[data-key="1"]`)
        .click({ force: true })
        .should('have.css', 'background-color', activeBgColor)
        .parents('table')
        .find(`td[data-key="2"]`)
        .should('have.css', 'background-color', defualtBgColor)
        .parents('table')
        .find(`td[data-key="3"]`)
        .should('have.css', 'background-color', defualtBgColor);
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
        .should('have.class', 'has-error')
        .find('.ant-form-explain')
        .invoke('text')
        .should('eq', 'این فیلد اجباری است');

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
        .eq(1)
        .find('td[data-key="1"]')
        .click({ force: true });

      cy.wrap(items)
        .eq(2)
        .find('td[data-key="1"]')
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
