const baseUrl = Cypress.env('baseUrl');

context('Viewport', () => {
  it('login work correctly', () => {
    cy.visit(`${baseUrl}/auth/otp`);
    cy.get('.ant-input')
      .first()
      .type('09111111111')
      .get('.ant-btn.ant-btn-primary.ant-btn-block')
      .click()
      .wait(4000);
  });

  it('OTP work correctly', () => {
    cy.get('.ant-input')
      .type('91112')
      .get('.ant-btn.ant-btn-primary.ant-btn-block')
      .click()
      .wait(4000)
      .get('.ant-input')
      .type('0197028233')
      .get('.ant-checkbox-input')
      .click()
      .get('.ant-btn')
      .click();
  });
});
