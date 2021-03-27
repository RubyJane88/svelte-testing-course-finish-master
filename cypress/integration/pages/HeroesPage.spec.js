/// <reference types="cypress"/>

const HEROES = [
  {
    id: 'HeroAslaug',
    name: 'Aslaug',
    description: 'warrior queen',
  },
  {
    id: 'HeroIvar',
    name: 'Ivar the Boneless',
    description: 'commander of the Great Heathen Army',
  },
];

describe('Heroes Page', () => {
  beforeEach(() => {
    cy.getCommand('/api/heroes', HEROES);
    cy.visit('/');
  });

  it('should land on the heroes page', () => {
    cy.location('pathname').should('equal', '/heroes');
  });

  it('should render heroes', () => {
    cy.get('[data-testid=card]').should('have.length', 2);
  });

  it('should not delete a hero when cancelled', () => {
    const index = 1;
    cy.get('[data-testid=button]')
      .filter(':contains("Delete")')
      .eq(index)
      .click();
    cy.get('[data-testid=no-button]').click();

    cy.get('[data-testid=card]').should('have.length', HEROES.length);
  });

  it('should delete a hero when click yes', () => {
    const index = 1;
    cy.deleteCommand('/api/heroes/*', HEROES, index);

    cy.get('[data-testid=button]')
      .filter(':contains("Delete")')
      .eq(index)
      .click();

    cy.get('[data-testid=yes-button]').click();

    cy.get('[data-testid=card]').should('have.length', HEROES.length - 1);
  });

  it('should not add a new hero when cancelled', () => {
    cy.get('[data-testid=plus-button]').click();
    cy.SetupInputFieldsCommand();
    cy.get('@Name').type('Ruben');
    cy.get('@Description').type('Col.');
    cy.get('[data-testid=button]').contains('Cancel').click();
    cy.get('[data-testid=card]').should('have.length', HEROES.length);
  });

  it('should add a new hero', () => {
    const name = 'Ruben';
    const description = 'Col.';

    cy.get('[data-testid=plus-button]').click();
    cy.SetupInputFieldsCommand();
    cy.get('@Name').type(name);
    cy.get('@Description').type(description);
    cy.postCommand('/heroes', { name, description });
    cy.get('[data-testid=button]').contains('Save').click();

    cy.get('[data-testid=card]').should('have.length', HEROES.length + 1);
  });

  it('should update an existing hero', () => {
    const index = 0;
    const heroToEdit = HEROES[index];
    const editedDescription = 'Viking Queen';

    cy.get('[data-testid=button]')
      .filter(':contains("Edit")')
      .eq(index)
      .click();

    cy.SetupInputFieldsCommand();

    cy.get('@Description').clear().type(editedDescription);
    cy.putCommand('/heroes', { ...heroToEdit, description: editedDescription });
    cy.get('[data-testid=button]').contains('Save').click();

    cy.get('[data-testid=card]').should('have.length', HEROES.length);
    cy.get('[data-testid=card-description]')
      .eq(index)
      .should('contain', 'Viking');
  });
});
