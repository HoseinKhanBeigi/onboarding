describe('text input fieldGenerator', () => {
  const fixtureDir = 'filedGenerator3/numberInput';
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
      .type('55')
      .get('input[name=field2]')
      .type('35')
      .get('.ant-btn[type=submit]')
      .click()
      .get('.ant-alert')
      .contains('خطا در ارسال! لطفا اطلاعات وارد شده را مجددا برسی نمایید!');
  });

  it('required input', () => {
    cy.get('input[name=field2]')
      .type('50')
      .get('.ant-btn[type=submit]')
      .click()
      .get('.ant-form-explain')
      .contains('این فیلد اجباری است');
  });

  it('max validation test', () => {
    cy.get('input[name=field2]')
      .type('85')
      .get('input[name=field1]')
      .type('200')
      .get('.ant-btn[type=submit]')
      .click()
      .get('.ant-form-explain')
      .contains('نباید بیشتر از 80 باشد');
  });

  it('min validation test', () => {
    cy.get('input[name=field2]')
      .type('1')
      .get('input[name=field1]')
      .type('2')
      .get('.ant-btn[type=submit]')
      .click()
      .get('.ant-form-explain')
      .contains('نباید کمتر از 10 باشد');
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
