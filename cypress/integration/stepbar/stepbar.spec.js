describe('Stepbar Component', () => {
  const productName = Cypress.env('productName');
  const applicationId = Cypress.env('applicationId');
  const fixtureDir = 'stepbar';

  const stepsList = [
    { title: 'مرحله اول', stageName: 'one', state: 'EMPTY' },
    { title: 'مرحله دوم', stageName: 'two', state: 'EMPTY' },
    { title: 'مرحله سوم', stageName: 'three', state: 'FILLED' },
    { title: 'مرحله چهارم', stageName: 'four', state: 'LOCKED' },
    { title: 'مرحله پنجم', stageName: 'five', state: 'ERROR' },
  ];

  beforeEach(() => {
    cy.initMock(fixtureDir);
  });

  it('Generate List Of Step And Check Icons', () => {
    cy.get('.ant-steps-item').then(steps => {
      expect(steps).to.have.length(5);

      steps.map((index, step) => {
        cy.wrap(step)
          .find('.ant-steps-item-title')
          .should('contain', stepsList[index].title);

        if (stepsList[index].state === 'ERROR') {
          cy.wrap(step)
            .find('.anticon')
            .should('have.class', 'anticon-exclamation');
        } else if (stepsList[index].state === 'FILLED') {
          cy.wrap(step)
            .find('.anticon')
            .should('have.class', 'anticon-check');
        } else if (stepsList[index].state === 'LOCKED') {
          cy.wrap(step)
            .find('.anticon')
            .should('have.class', 'anticon-lock');
        } else {
          cy.wrap(step)
            .find('.ant-steps-icon')
            .should('contain', index + 1);
        }
      });
    });
  });

  it('Click Step To Navigate, URL Change and Active Step', () => {
    stepsList.map((step, index) => {
      cy.contains(step.title)
        .parents('div[role="button"]')
        .click({ force: true })
        .wait(1000);

      let urlCondition = 'include';
      let haveClassCondition = 'have.class';
      if (step.state === 'LOCKED') {
        urlCondition = 'not.include';
        haveClassCondition = 'not.have.class';
      }

      cy.url().should(
        urlCondition,
        `/onboarding/${productName}/${step.stageName}/${applicationId}`,
      );

      cy.get('div.ant-steps')
        .find('.ant-steps-item')
        .eq(index)
        .should(haveClassCondition, 'ant-steps-item-active');
    });
  });

  it('Navigation By Submit And Handle Back Browser', () => {
    cy.server();
    cy.route(
      'PUT',
      `**/applications/${applicationId}/one`,
      `fixture:${fixtureDir}/application.response.stage1.json`,
    );

    cy.get('.ant-steps-item').then(steps => {
      cy.wrap(steps)
        .eq(1)
        .find('div[role="button"]')
        .click({ force: true })
        .parent()
        .should('have.class', 'ant-steps-item-active');

      cy.url().should(
        'include',
        `/onboarding/${productName}/two/${applicationId}`,
      );

      cy.wrap(steps)
        .eq(0)
        .find('.anticon')
        .should('have.class', 'anticon-question');

      cy.go('back');

      cy.wrap(steps)
        .eq(0)
        .should('have.class', 'ant-steps-item-active');

      cy.url().should(
        'include',
        `/onboarding/${productName}/one/${applicationId}`,
      );

      cy.get('input[name="field"]').type('لورم ایپسوم یک متن تستی است');

      cy.contains('button', 'مرحله بعد').click();

      cy.url().should(
        'include',
        `/onboarding/${productName}/two/${applicationId}`,
      );

      cy.wrap(steps)
        .eq(0)
        .find('.anticon')
        .should('have.class', 'anticon-check');

      cy.wrap(steps)
        .eq(1)
        .should('have.class', 'ant-steps-item-active');
    });
  });

  it('Render Error Stage', () => {
    cy.contains('مرحله پنجم').click();

    cy.get('.ant-alert').then(alerts => {
      cy.wrap(alerts).should('have.length', 2);

      cy.wrap(alerts)
        .eq(0)
        .find('button.ant-alert-close-icon')
        .click()
        .wait(500);

      cy.wrap(alerts).should('have.length', 1);
    });
  });
});
