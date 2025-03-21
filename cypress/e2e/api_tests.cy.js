describe('Tests API - Eco Bliss Bath', () => {
    const baseUrl = 'http://localhost:8081';
    let authToken = '';

    before(() => {
        // Connexion et récupération du token
        cy.request({
            method: 'POST',
            url: `${baseUrl}/login`,
            body: {
                username: 'test2@test.fr',
                password: 'testtest'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            authToken = response.body.token;
        });
    });

    it('GET - Accès interdit au panier sans authentification', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/orders`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401); 
        });
    });

    it('GET - Récupération du panier après connexion', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/orders`,
            headers: { Authorization: `Bearer ${authToken}` }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('orderLines');
        });
    });

    it('GET - Récupération des détails d’un produit', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/products/3`, 
            headers: { Authorization: `Bearer ${authToken}` }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', 3);
        });
    });

    it('GET - Récupération de la liste des produits', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/products`
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('GET - Récupération de produits aléatoires', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/products/random`
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').that.has.length(3);
        });
    });

    it('GET - Récupération de la liste des avis', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/reviews`
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('GET - Récupération des infos utilisateur connecté', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/me`,
            headers: { Authorization: `Bearer ${authToken}` }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('email');
        });
    });

    it('POST - Échec de connexion avec identifiants invalides', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/login`,
            failOnStatusCode: false,
            body: {
                username: 'invalide@test.fr',
                password: 'wrongpassword'
            }
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });

    it('POST - Création d’une commande', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/orders`,
            headers: { Authorization: `Bearer ${authToken}` },
            body: {
                firstname: 'John',
                lastname: 'Doe',
                address: '123 Rue Test',
                zipCode: '75000',
                city: 'Paris'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('POST - Enregistrement d’un nouvel utilisateur', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/register`,
            failOnStatusCode: false,
            body: {
                email: 'newuser@test.fr',
                firstname: 'New',
                lastname: 'User',
                plainPassword: 'password123'
            }
        }).then((response) => {
            expect(response.status).to.be.oneOf([200, 400]);
        });
    });

    it('POST - Ajout d’un produit au panier (ATTENTION : Devrait être un PUT)', () => {
        cy.request({
            method: 'PUT', 
            url: `${baseUrl}/orders/add`,
            headers: { Authorization: `Bearer ${authToken}` },
            body: {
                product: 3,
                quantity: 1
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('POST - Ajout d’un avis après connexion', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/reviews`,
            headers: { Authorization: `Bearer ${authToken}` },
            body: {
                title: 'Super produit',
                comment: 'J’ai adoré ce savon, il sent très bon.',
                rating: 5
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});
