//data-testid="nav-villains"

/// <reference types="cypress"/>

const VILLAINS = [
  {
    id: 'VillainMadelyn',
    name: 'Madelyn',
    description: 'the cat whisperer',
  },
  {
    id: 'VillainHaley',
    name: 'Haley',
    description: 'pen wielder',
  },
];

describe('Villains Page', () => {
  beforeEach(() => {
    cy.getCommand('/api/villains', VILLAINS);
    cy.visit('/');
    cy.get('[data-testid=nav-villains]').click();
  });

  it('should land on the villains page', () => {
    cy.location('pathname').should('equal', '/villains');
  });

  it('should render villains', () => {
    cy.get('[data-testid=villains-card]').should('have.length', 2);
  });

  it('should not delete a villain when clicked cancelled', () => {
    const index = 1;

    cy.get('[data-testid=button]')
      .filter(':contains("Delete")')
      .eq(index)
      .click();

    cy.get('[data-testid=villains-card]').should(
      'have.length',
      VILLAINS.length
    );
  });

  it('should delete a villain when clicked yes', () => {
    const index = 1;
    cy.deleteCommand('api/villains/*', VILLAINS, index);

    cy.get('[data-testid=button]')
      .filter(':contains("Delete")')
      .eq(index)
      .click();

    cy.get('[data-testid=yes-button]').click();

    cy.get('[data-testid=villains-card]').should(
      'have.length',
      VILLAINS.length - 1
    );
  });

  it('should not add a new villain when cancel button is clicked', () => {
    cy.get('[data-testid=plus-button]').click();
    cy.SetupInputFieldsCommand();
    cy.get('@Name').type('Harlequin');
    cy.get('@Description').type('Mad girl in love');
    cy.get('[data-testid=button]').contains('Cancel').click();
    cy.get('[data-testid=villains-card]').should(
      'have.length',
      VILLAINS.length
    );
  });

  it('should add a new villain', () => {
    const name = 'Harlequin';
    const description = 'Pike';

    cy.get('[data-testid=plus-button]').click();
    cy.SetupInputFieldsCommand();
    cy.get('@Name').type(name);
    cy.get('@Description').type(description);
    cy.postCommand('/villains', { name, description });
    cy.get('[data-testid=button]').contains('Save').click();
    // console.log('save a villain');

    cy.get('[data-testid=villains-card]').should(
      'have.length',
      VILLAINS.length + 1
    );
  });

  it('should update an existing villain', () => {
    const index = 0;
    const villainToEdit = VILLAINS[index];
    const editedDescription = 'Mad Girl';

    cy.get('[data-testid=button]')
      .filter(':contains("Edit")')
      .eq(index)
      .click();

    cy.SetupInputFieldsCommand();
    //fghgf
    cy.get('@Description').clear().type(editedDescription);
    cy.putCommand('/villains', {
      ...villainToEdit,
      description: editedDescription,
    });
    cy.get('[data-testid=button]').contains('Save').click();

    cy.get('[data-testid=villains-card]').should(
      'have.length',
      VILLAINS.length
    );

    cy.get('[data-testid=card-description]').eq(index).should('contain', 'Mad');
  });
});
