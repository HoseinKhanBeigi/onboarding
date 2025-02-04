describe('Locations In Filed Generator Part 2', () => {
  const applicationId = Cypress.env('applicationId');
  const productName = Cypress.env('productName');
  const fixtureDir = 'filedGenerator2/locations';

  beforeEach(() => {
    cy.initMock(fixtureDir);
  });

  it('Render', () => {
    cy.get('@products').then(products => {
      const { entities } = products.stages[0].groups[0];
      cy.get('.ant-form-item')
        .should('have.length', entities.length)
        .then(items => {
          items.map((index, item) => {
            if (
              entities[index].entity.initialData &&
              entities[index].entity.initialData.length > 0
            ) {
              cy.wrap(item)
                .find('div.locations')
                .should('have.class', entities[index].entity.name)
                .find('input[type="radio"]')
                .each((input, inputIndex) => {
                  const initialItem =
                    entities[index].entity.initialData[inputIndex];

                  cy.wrap(input)
                    .should('have.attr', 'value', initialItem.addressType)
                    .parents('div.locations-item')
                    .and('contain', initialItem.street);
                });
            } else {
              cy.wrap(item)
                .find('div.locations')
                .should('have.class', entities[index].entity.name)
                .and(
                  'contain',
                  'شما هیچ آدرسی ثبت نکرده‌اید، لطفا آدرس جدید ثبت کنید، یا تلفنی هماهنگ شود را انتخاب کنید.',
                );
            }

            cy.wrap(item).should('contain', entities[index].entity.label);
          });
        });
    });
  });

  it('Initial Value', () => {
    cy.get('@application').then(application => {
      const filedsData = application.stages[0].data;
      for (const key in filedsData) {
        if (filedsData[key] !== null) {
          cy.get(`div.locations.${key}`)
            .find(`input[value="${filedsData[key]}"]`)
            .should('be.checked');
        }
      }
    });
  });

  it('Action', () => {
    cy.get('div.locations.field1')
      .find('input')
      .then(inputs => {
        cy.wrap(inputs)
          .eq(0)
          .should('not.be.checked')
          .click({ force: true })
          .should('be.checked');

        cy.wrap(inputs)
          .eq(1)
          .should('not.be.checked');

        cy.wrap(inputs)
          .eq(2)
          .should('not.be.checked')
          .click({ force: true })
          .should('be.checked');

        cy.wrap(inputs)
          .eq(0)
          .should('not.be.checked');

        cy.wrap(inputs)
          .eq(1)
          .should('not.be.checked');
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
        .should('have.class', 'has-error')
        .find('.ant-form-explain')
        .invoke('text')
        .should('eq', 'این فیلد اجباری است');

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
        .should('have.class', 'has-success');

      cy.wrap(items)
        .eq(3)
        .find('.ant-form-item-control')
        .should('have.class', 'has-success');

      cy.wrap(items)
        .eq(0)
        .find('input')
        .eq(1)
        .click({ force: true });

      cy.wrap(items)
        .eq(1)
        .find('input')
        .eq(0)
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
