describe('text input fieldGenerator', () => {
  const fixtureDir = 'filedGenerator3/telInput';
  beforeEach(() => {
    cy.initMock(fixtureDir);
  });

  it('Render', () => {
    cy.get('@products').then(products => {
      const { entities } = products.stages[0].groups[0];
      cy.get('.ant-form-item')
        .should('have.length', entities.length)
        .each((item, index) => {
          cy.wrap(item)
            .find('input')
            .invoke('prop', 'type')
            .should('eq', 'text');

          cy.wrap(item)
            .find('input')
            .invoke('prop', 'name')
            .should('eq', entities[index].entity.name);

          cy.wrap(item).should('contain', entities[index].entity.label);
        });
    });
  });

  it('Initial Value', () => {
    cy.get('@application').then(application => {
      const filedsData = application.stages[0].data;
      cy.get('input[name=field3]').should('have.value', filedsData.field3);
    });
  });

  it('input work correctly', () => {
    cy.get('input[name=field1]')
      .first()
      .type('02120640511')
      .get('input[name=field2]')
      .type('041325456')
      .get('.ant-btn[type=submit]')
      .click();
  });

  it('required input', () => {
    cy.get('input[name=field2]')
      .first()
      .type('02120740512')
      .get('.ant-btn[type=submit]')
      .click()
      .get('.ant-form-explain')
      .contains('این فیلد اجباری است');
  });

  it('validation', () => {
    cy.get('input[name=field2]')
      .first()
      .type('021253241562')
      .get('input[name=field1]')
      .type('021253241562')
      .get('.ant-btn[type=submit]')
      .click()
      .get('.ant-form-explain')
      .contains('نباید بیشتر از 11 کاراکتر باشد');
  });

  it('text typing validation test', () => {
    cy.get('input[name=field2]')
      .type('متن تستی')
      .get('input[name=field1]')
      .should('have.value', '')
      .type('متن تستی دو')
      .get('.ant-btn[type=submit]')
      .should('have.value', '');
  });
});
