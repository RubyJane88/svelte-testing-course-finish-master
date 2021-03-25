/// <reference types="cypress"/>
import '@cypress/code-coverage/support';
import '@bahmutov/cy-api/support';
import '@testing-library/cypress/add-commands';
import { v4 as uuidv4 } from 'uuid';

Cypress.Commands.add('getCommand', (url, responseBody) => {
  cy.intercept('GET', url, {
    statusCode: 200,
    body: responseBody,
  });
});

Cypress.Commands.add('deleteCommand', (url) => {
  cy.intercept('DELETE', url, {
    statusCode: 204,
  });
});

Cypress.Commands.add('postCommand', (url, requestBody) => {
  requestBody.id = uuidv4();

  cy.intercept('POST', url, {
    statusCode: 201,
    body: requestBody,
  });
});

Cypress.Commands.add('putCommand', (url, requestBody) => {
  cy.intercept('PUT', url, {
    statusCode: 200,
    body: requestBody,
  });
});

Cypress.Commands.add('SetupInputFieldsCommand', () => {
  cy.get('[data-testid=name]').as('Name');
  cy.get('[data-testid=description]').as('Description');
});
