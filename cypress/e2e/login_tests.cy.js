describe('Tests Connexion - Eco Bliss Bath', () => {
    const frontUrl = 'http://localhost:8080/#/login';

    describe('Connexion utilisateur - Front', () => {
        beforeEach(() => {
            cy.visit(frontUrl);
        });

        it('Affichage du formulaire de connexion', () => {
            cy.get('[data-cy=login-form]').should('be.visible');
            cy.get('[data-cy=login-input-username]').should('be.visible');
            cy.get('[data-cy=login-input-password]').should('be.visible');
            cy.get('[data-cy=login-submit]').should('be.visible');
        });

        it('Connexion avec des identifiants valides', () => {
            cy.get('[data-cy=login-input-username]').type('test2@test.fr');
            cy.get('[data-cy=login-input-password]').type('testtest');
            cy.get('[data-cy=login-submit]').click();
            // Attendre la requête de connexion
            cy.intercept('POST', 'http://localhost:8081/login').as('loginRequest');
            cy.wait('@loginRequest');

            // Vérification de la redirection vers la page d’accueil
            cy.url({timeout: 10000}).should('eq', 'http://localhost:8080/#/');
            
            // Vérification de la présence du bouton panier
            cy.get('[data-cy=nav-link-cart]').should('be.visible');
        });

        it('Échec de connexion avec des identifiants incorrects', () => {
            cy.get('[data-cy=login-input-username]').type('wrong@test.fr');
            cy.get('[data-cy=login-input-password]').type('wrongpass');
            cy.get('[data-cy=login-submit]').click();
            
            // Vérification du message d'erreur
            cy.get('[data-cy=login-errors]').should('contain', 'Identifiants incorrects');
        });
    });
});