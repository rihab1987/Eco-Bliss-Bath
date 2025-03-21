describe('Tests d affichage des produits - Eco Bliss Bath', () => {
    const homeUrl = 'http://localhost:8080/#/';

    describe('Affichage des produits sur la page d accueil', () => {
        beforeEach(() => {
            cy.visit(homeUrl);
        });

        it('Vérifier que la page charge bien', () => {
            cy.get('.list-products', { timeout: 10000 }).should('be.visible');
        });

        it('Vérifier que tous les produits sont affichés avec leurs informations', () => {
            cy.get('.list-products', { timeout: 10000 })
                .should('exist')
                .children()
                .should('have.length.at.least', 1);

            cy.wait(3000);

            cy.get('.list-products').children().each(($product) => {
                // Affiche le HTML de chaque produit pour debug
                cy.wrap($product).invoke('html').then(html => {
                    cy.log('Produit HTML :', html);
                });

                cy.wrap($product).find('[data-cy=product-name]').should('exist').should('be.visible');
                cy.wrap($product).find('[data-cy=product-ingredients]').should('exist').should('be.visible');
                cy.wrap($product).find('[data-cy=product-price]').should('exist').should('be.visible');
                cy.wrap($product).find('[data-cy=product-link]').should('exist').should('be.visible');

                // Vérification de la présence de l’image (facultatif)
                if ($product.find('[data-cy=product-picture]').length) {
                    cy.wrap($product).find('[data-cy=product-picture]').should('be.visible');
                } else {
                    cy.log('⚠️ Aucune image trouvée pour ce produit');
                }
            });
        });
    });

    describe('Affichage des détails d un produit', () => {
        beforeEach(() => {
            cy.visit(homeUrl);
        });

        it('Vérifier l affichage des détails d un produit', () => {
            cy.get('.list-products', { timeout: 10000 }).should('be.visible');
            cy.wait(2000);

            // Vérifier que la liste des produits contient au moins 1 produit avant de cliquer
            cy.get('[data-cy=product-link]', { timeout: 10000 })
                .should('exist')
                .should('be.visible')
                .should('have.length.at.least', 1)
                .first()
                .click();

            // Vérifier que les détails sont bien affichés
            cy.get('[data-cy=detail-product-name]').should('be.visible');
            cy.get('[data-cy=detail-product-description]').should('be.visible');
            cy.get('[data-cy=detail-product-skin]').should('be.visible');
            cy.get('[data-cy=detail-product-aromas]').should('be.visible');
            cy.get('[data-cy=detail-product-ingredients]').should('be.visible');
            cy.get('[data-cy=detail-product-price]').should('be.visible');
            cy.get('[data-cy=detail-product-stock]').should('be.visible');
        });
    });
});