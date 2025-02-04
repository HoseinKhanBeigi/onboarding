// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload';

const productName = Cypress.env('productName');
const applicationId = Cypress.env('applicationId');
const token = Cypress.env('token');

Cypress.Commands.add(
  'initMock',
  (
    fixtureDir,
    startStage = 'one',
    configFiles = {
      stateMachine: 'stateMachine.json',
      products: 'products.json',
      application: 'application.json',
    },
  ) => {
    cy.fixture(`${fixtureDir}/${configFiles.stateMachine}`).as('stateMachine');
    cy.fixture(`${fixtureDir}/${configFiles.products}`).as('products');
    cy.fixture(`${fixtureDir}/${configFiles.application}`).as('application');

    cy.server();
    cy.route('GET', `**/state-machine/${productName}`, '@stateMachine');
    cy.route('GET', `**/products/${productName}`, '@products');
    cy.route('GET', `**/applications/${applicationId}`, '@application');

    cy.visit(`/onboarding/${productName}/${startStage}/${applicationId}`, {
      onBeforeLoad(window) {
        window.localStorage.setItem('token', token);
      },
    });

    cy.url().should(
      'include',
      `/onboarding/${productName}/${startStage}/${applicationId}`,
    );
  },
);
