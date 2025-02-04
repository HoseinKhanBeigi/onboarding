describe('Form', () => {
  const productName = Cypress.env('productName');
  const applicationId = Cypress.env('applicationId');

  const fixtureDir = 'form';

  const stepOneItems = [
    {
      label: 'فیلد اول',
      placeHolder: 'مقدار فیلد اول را وارد کنید',
      hidden: false,
    },
    {
      label: 'فیلد دوم',
      placeHolder: 'مقدار فیلد دوم را وارد کنید',
      hidden: false,
    },
    {
      label: 'فیلد سوم',
      placeHolder: 'مقدار فیلد سوم را وارد کنید',
      hidden: false,
    },
    {
      label: 'فیلد چهارم',
      placeHolder: 'مقدار فیلد چهارم را وارد کنید',
      hidden: true,
    },
  ];

  const stepTwoItems = [
    { value: 'مقدار اول' },
    { value: 'مقدار دوم' },
    { value: 'مقدار سوم' },
  ];

  beforeEach(() => {
    cy.initMock(fixtureDir);
  });

  it('Render Items (hidden)', () => {
    cy.get('form')
      .find('.ant-form-item')
      .then(items => {
        cy.wrap(items).should('have.length', 4);

        items.map((index, item) => {
          if (stepOneItems[index].hidden === false) {
            cy.wrap(item)
              .find('label')
              .should('contain', stepOneItems[index].label);

            cy.wrap(item)
              .find('input')
              .invoke('attr', 'placeholder')
              .should('eq', stepOneItems[index].placeHolder);
          }
        });
      });
  });

  it('Initial Value From Application', () => {
    cy.contains('مرحله دوم')
      .click()
      .wait(1000);

    cy.url().should(
      'include',
      `/onboarding/${productName}/two/${applicationId}`,
    );

    cy.get('.ant-form-item').then(items => {
      items.map((index, item) => {
        cy.wrap(items).should('have.length', 3);

        cy.wrap(item)
          .find('input')
          .invoke('prop', 'value')
          .should('eq', stepTwoItems[index].value);
      });
    });
  });

  it('Handle Validation', () => {
    cy.server();
    cy.route(
      'PUT',
      `**/applications/${applicationId}/one`,
      `fixture:${fixtureDir}/application.validation.json`,
    );

    cy.contains('مرحله بعد').then(submitButton => {
      cy.get('.ant-form-item').then(items => {
        cy.wrap(submitButton).click();

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
          .eq(0)
          .find('input')
          .type('لورم ایپسوم یک متن تستی است');

        cy.wrap(items)
          .eq(1)
          .find('input')
          .type('لورم ایپسوم یک متن تستی است');

        cy.wrap(submitButton).click();

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
          .should('eq', 'نباید بیشتر از 6 کاراکتر باشد');

        cy.wrap(items)
          .eq(1)
          .find('.ant-form-item-control')
          .should('have.class', 'has-success');

        cy.wrap(items)
          .eq(0)
          .find('input')
          .clear()
          .type('لورم !');

        cy.wrap(submitButton)
          .click()
          .wait(1000);

        cy.url().should(
          'include',
          `/onboarding/${productName}/two/${applicationId}`,
        );
      });
    });
  });

  it('depend field work', () => {
    cy.contains('مرحله سوم')
      .click()
      .wait(1000);
    cy.get('.ant-select-selection__rendered')
      .click()
      .get('.ant-select-dropdown-menu-item')
      .contains('سفته')
      .click({ force: true })
      .get('.ant-slider-mark-text')
      .should('have.length', 2);
  });
});
