const username = "test2@test.fr";
const password = "testtest";
const baseURL = "http://localhost:8080/#/";

describe("Smoke Tests - Eco Bliss Bath", () => {
    
    it("Vérifier la présence des champs et boutons de connexion", () => {
        cy.visit(baseURL + "login");
        cy.get("[data-cy=login-input-username]").should("be.visible");
        cy.get("[data-cy=login-input-password]").should("be.visible");
        cy.get("[data-cy=login-submit]").should("be.visible");
        cy.log("Les champs et le bouton de connexion sont visibles");
    });

    it("Vérifier la présence du bouton d’ajout au panier après connexion", () => {
        cy.visit(baseURL + "login");
        cy.get("[data-cy=login-input-username]").type(username);
        cy.get("[data-cy=login-input-password]").type(password);
        cy.get("[data-cy=login-submit]").click();
        cy.wait(2000);

        cy.visit(baseURL + "products");
        
        // Vérifier que la liste des produits est bien chargée
        cy.get('.list-products', { timeout: 10000 }).should("have.length.at.least", 1);

        // Ouvrir un produit
        cy.get('.add-to-cart').first().should("exist").click();
        cy.wait(800);

        // Vérifier la présence du bouton d'ajout au panier
        cy.get("[data-cy=detail-product-add]").should("be.visible");
        cy.log("✅ Le bouton d'ajout au panier est bien visible après connexion !");
    });

    it("Vérifier la présence du champ de disponibilité du produit", () => {
        cy.visit(baseURL + "products");
        cy.wait(2000);

        cy.get(".mini-product").first().find("[data-cy=product-link]").click();
        cy.wait(800);
        
        cy.get("[data-cy=detail-product-stock]").should("be.visible");
        cy.log("Le champ de disponibilité du produit est visible");
    });

});

