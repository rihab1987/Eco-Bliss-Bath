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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getBySel", (selector, ...args) => {
    return cy.get(`[data-cy="${selector}"]`, ...args);
  });
  
  Cypress.Commands.add("loginAPI", (username, password) => {
    return cy.request({
      method: "POST",
      url: Cypress.env("apiURL") + "login",
      body: { username, password },
    }).then((response) => {
      expect(response.status).to.eq(200);
      return response.body.token;
    });
  });
  
  Cypress.Commands.add("loginUI", () => {
    cy.visit("/login");
    cy.get("[data-cy='login-input-username']").type(Cypress.env("username"));
    cy.get("[data-cy='login-input-password']").type(Cypress.env("password"));
    cy.get("[data-cy='login-submit']").click();
  });
  