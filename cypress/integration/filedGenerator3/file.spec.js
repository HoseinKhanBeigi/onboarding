describe('text input fieldGenerator', () => {
  const fixtureDir = 'filedGenerator3/file';

  beforeEach(() => {
    cy.initMock(fixtureDir);
    cy.fixture('filedGenerator3/file/upload.json').as('uploadJSON');
    cy.route('POST', '**/upload', '@uploadJSON').as('uploadFile');
  });
  const fileFixturePath = 'filedGenerator3/file/test-image.jpg';

  it('Render correctly', () => {
    cy.get('@products').then(products => {
      const { entities } = products.stages[0].groups[0];
      cy.get('.ant-form-item')
        .should('have.length', entities.length)
        .each((item, index) => {
          cy.wrap(item)
            .find('input')
            .invoke('prop', 'type')
            .should('eq', 'file');

          cy.wrap(item)
            .find('div')
            .should('contain', entities[index].entity.label);

          cy.wrap(item).should('contain', entities[index].entity.label);
        });
    });
  });

  it('upload and preview work correctly', () => {
    cy.get('input[type=file]')
      .first()
      .attachFile(fileFixturePath)
      .get('.ant-upload-select-picture-card')
      .find('img')
      .invoke('prop', 'alt')
      .should('eq', 'avatar');
  });

  it('submit form work', () => {
    cy.get('input[type=file]')
      .each((item, index) => {
        cy.wrap(item).attachFile(fileFixturePath);
      })
      .get('button')
      .contains('مرحله بعد')
      .wait(1000)
      .click({ force: true })
      .get('.ant-alert-message')
      .contains('خطا در ارسال! لطفا اطلاعات وارد شده را مجددا برسی نمایید!');
  });

  it('required validation work', () => {
    cy.get('input[type=file]')
      .first()
      .attachFile(fileFixturePath)
      .get('button')
      .contains('مرحله بعد')
      .wait(1000)
      .click({ force: true })
      .get('.ant-alert-message')
      .should('not.exist');
  });
});
