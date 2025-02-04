const baseUrl = Cypress.env('baseUrl');
const serverUrl = Cypress.env('serverUrl');

describe('OTP with mock', () => {
  beforeEach(() => {
    cy.fixture('otp/otp_page.json').as('otpJSON');
    cy.fixture('otp/otp_verify.json').as('verifyJSON');
    cy.fixture('otp/applications.json').as('applications');
    cy.fixture('otp/newApplications.json').as('newApplications');
    cy.server();
  });

  it('login work correctly', () => {
    // TODO: integrate with the new api
    // cy.route('POST', `${serverUrl}/auth/initiable`, '@otpJSON').as(
    //   'loginRequest',
    // );
    //
    // cy.visit(`${baseUrl}/auth/otp`);
    //
    // cy.get('.ant-input')
    //   .first()
    //   .type('09111111111')
    //   .get('.ant-btn.ant-btn-primary.ant-btn-block')
    //   .click()
    //   .wait('@loginRequest')
    //   .wait(1000);
  });

  it('OTP work correctly', () => {
    cy.route('POST', `${serverUrl}/auth/verify`, '@verifyJSON').as(
      'verifyOtpRequest',
    );
    cy.route('GET', `${serverUrl}/applications`, '@applications').as(
      'submitNationalCode',
    );
    cy.get('.ant-input')
      .first()
      .type('91112')
      .get('.ant-btn.ant-btn-primary.ant-btn-block')
      .click()
      .wait('@verifyOtpRequest')
      .wait(1000);
  });

  it('submit new application work correctly', () => {
    cy.route('POST', `${serverUrl}/applications`, '@newApplications');
    cy.get('.ant-input')
      .first()
      .type('0197028233')
      .get('.ant-checkbox-input')
      .click()
      .get('.ant-btn')
      .click();
  });
});
