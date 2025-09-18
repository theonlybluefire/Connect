it('testBasicButtons', function() {
    cy.visit('http://localhost:5173/login')
    cy.get('[name="ion-input-0"]').click();
    cy.get('[name="ion-input-0"]').type('test@connect.app',{delay:100});
    cy.get('[name="ion-input-1"]').click();
    cy.get('[name="ion-input-1"]').type('testUser',{delay:100});
    cy.get('[name="ion-input-0"]').click();
    cy.get('[name="ion-input-1"]').click();
    cy.wait(1000);
    cy.get('#root .button').click();
    cy.get('#open-filter-modal').click();
    cy.get('#ion-overlay-2 .button').first().click();
    cy.get('.ion-color.ion-color-primary.ios.ion-activatable.hydrated').first().click();
    cy.wait(1000);
    cy.get('.ios.ion-activatable.hydrated.animated-gradient').first().click();
    cy.visit('http://localhost:5173/logout')
    cy.wait(500);
    cy.get('#root .button').first().click();
    
});