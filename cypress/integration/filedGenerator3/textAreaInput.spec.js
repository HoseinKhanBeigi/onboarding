describe('text input fieldGenerator', () => {
  const fixtureDir = 'filedGenerator3/textArea';
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
            .find('textarea')
            .invoke('prop', 'name')
            .should('eq', entities[index].entity.name);

          cy.wrap(item).should('contain', entities[index].entity.label);
        });
    });
  });

  it('Initial Value', () => {
    cy.get('@application').then(application => {
      const filedsData = application.stages[0].data;
      cy.get('textarea[name=field3]').should('have.value', filedsData.field3);
    });
  });

  it('textarea work correctly', () => {
    cy.get('textarea[name=field1]')
      .first()
      .type('کبری')
      .get('textarea[name=field2]')
      .type('کبریتی')
      .get('.ant-btn[type=submit]')
      .click();
  });

  it('required textarea', () => {
    cy.get('textarea[name=field2]')
      .first()
      .type('خرچنگپور')
      .get('.ant-btn[type=submit]')
      .click()
      .get('.ant-form-explain')
      .contains('این فیلد اجباری است');
  });

  it('validation', () => {
    cy.get('textarea[name=field2]')
      .first()
      .type(
        'طولانی ترین نام خانوادگی دنیا طایفه حاجی نوروز علی تهرانی معروف به کلده دره است',
      )
      .get('textarea[name=field1]')
      .type('قلی')
      .get('.ant-btn[type=submit]')
      .click()
      .get('.ant-form-explain')
      .contains('نباید بیشتر از 60 کاراکتر باشد');
  });
});
