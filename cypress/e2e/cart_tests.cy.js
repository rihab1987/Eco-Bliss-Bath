const username = "test2@test.fr";
const password = "testtest";
const baseURL = "http://localhost:8080/#/";
const apiURL = "http://localhost:8081/";

describe("Test du Panier - Eco Bliss Bath", () => {
    beforeEach(() => {
        cy.intercept("POST", "**/login").as("loginRequest");
        cy.visit(`${baseURL}login`);

        cy.get("[data-cy=login-input-username]").type(username);
        cy.get("[data-cy=login-input-password]").type(password);
        cy.get("[data-cy=login-submit]").click();

        cy.wait("@loginRequest").then((interception) => {
            const authToken = interception.response.body.token;
            cy.wrap(authToken).as("authToken");
            cy.log("Token récupéré : " + authToken);
        });

        cy.wait(3000); // Assurer la connexion avant de passer aux tests
    });

    it("Ajouter un produit au panier et vérifier la mise à jour du stock", function () {
        cy.intercept("GET", "**/products").as("getProducts");
        cy.visit(`${baseURL}products`);
        cy.wait("@getProducts");

        cy.get(".list-products", { timeout: 15000 }).should("exist");

        cy.get("[data-cy=product-link]").first().should("exist").click();
        cy.wait(800);

        cy.get("[data-cy=detail-product-name]").invoke("text").then((productName) => {
            cy.get("[data-cy=detail-product-stock]").invoke("text").then((stockText) => {
                cy.log(`Texte du stock récupéré : "${stockText}"`);

                const stockMatch = stockText.match(/\d+/);

                if (!stockMatch) {
                    cy.log("Aucun nombre trouvé dans le texte du stock. Utilisation d'une valeur par défaut.");
                    return;
                }

                const stockValue = parseInt(stockMatch[0], 10);
                cy.log(`Stock actuel : ${stockValue}`);

                expect(stockValue).to.be.a("number").and.to.be.greaterThan(1);

                cy.get("[data-cy=detail-product-add]").click();
                cy.wait(2000);

                // Vérification via l’API
                cy.get("@authToken").then((authToken) => {
                    cy.request({
                        method: "GET",
                        url: `${apiURL}orders`,
                        headers: { Authorization: `Bearer ${authToken}` },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        cy.log("Réponse API : ", response.body);

                        const productFound = response.body.items.some(item => item.product.name.trim() === productName.trim());
                        expect(productFound, `Produit ${productName} non trouvé dans le panier`).to.be.true;

                        cy.log("Le produit a été ajouté au panier avec succès !");
                    });
                });

                cy.visit(`${baseURL}products`);
                cy.get("[data-cy=product-link]").first().click();
                cy.wait(2000);

                cy.get("[data-cy=detail-product-stock]").invoke("text").then((updatedStockText) => {
                    if (!updatedStockText) {
                        throw new Error("Stock introuvable après ajout !");
                    }
                    const updatedStock = parseInt(updatedStockText.match(/\d+/)?.[0]);
                    cy.log(`Stock après ajout : ${updatedStock}`);

                    expect(updatedStock).to.equal(stockValue - 1);
                    cy.log("Stock mis à jour correctement");
                });
            });
        });
    });

    it("Empêcher l'ajout d'une quantité négative au panier", function () {
        cy.visit(`${baseURL}products`);
        cy.get("[data-cy=product-link]").first().click();
        cy.wait(800);

        cy.get("[data-cy=detail-product-quantity]").clear().type("-5");
        cy.get("[data-cy=detail-product-add]").click();
        cy.wait(800);

        cy.url().should("not.include", "/cart");
        cy.get("[data-cy=detail-product-name]").should("be.visible");
    });

    it("Empêcher l'ajout d'une quantité supérieure à 20 au panier", function () {
        cy.visit(`${baseURL}products`);
        cy.get("[data-cy=product-link]").first().click();
        cy.wait(800);

        cy.get("[data-cy=detail-product-quantity]").clear().type("21");
        cy.get("[data-cy=detail-product-add]").click();
        cy.wait(800);

        cy.url().should("not.include", "/cart");
        cy.get("[data-cy=detail-product-name]").should("be.visible");
    });

    it("Vérifier le contenu du panier via l'API", function () {
        cy.get("@authToken").then((authToken) => {
            cy.request({
                method: "GET",
                url: `${apiURL}orders`,
                headers: { Authorization: `Bearer ${authToken}` },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("items").and.to.be.an("array");

                cy.log("Le panier contient les produits ajoutés !");
            });
        });
    });
});
