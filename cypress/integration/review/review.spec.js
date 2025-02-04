describe('Review Component', () => {
  const fixtureDir = 'review';
  const startStage = 'review';

  it('Render Fields', () => {
    const list = [
      { title: 'فیلد اول', value: 'مقدار اول' },
      { title: 'فیلد دوم', value: 'بله' },
      { title: 'فیلد سوم', value: 'بزرگمهر' },
      { title: 'فیلد چهارم', value: '16 تا 23' },
      { title: 'فیلد پنجم', value: 'گزینه اول' },
      { title: 'فیلد ششم', value: 'شش' },
      { title: 'فیلد هفتم', value: '123' },
      { title: 'فیلد هشتم', value: '09121121122' },
      { title: 'فیلد نهم', value: 'لورم ایپسوم یک متن تستی است.' },
    ];

    const configFiles = {
      stateMachine: 'stateMachine.fields.json',
      products: 'products.fields.json',
      application: 'application.fields.json',
    };

    cy.initMock(fixtureDir, startStage, configFiles);

    cy.get('[data-cy="row"]')
      .should('have.length', 9)
      .each((row, index) => {
        cy.wrap(row)
          .find('[data-cy="title"]')
          .should('contain', list[index].title);

        cy.wrap(row)
          .find('[data-cy="value"]')
          .should('contain', list[index].value);
      });
  });

  it('Stages Groups', () => {
    const list = [
      { title: 'فیلد اول', value: 'مقدار اول' },
      { title: 'فیلد دوم', value: 'مقدار دوم' },
      { title: 'فیلد اول', value: 'مقدار اول' },
      { title: 'فیلد دوم', value: 'مقدار دوم' },
      { title: 'فیلد اول', value: 'مقدار اول' },
    ];

    const configFiles = {
      stateMachine: 'stateMachine.stages.json',
      products: 'products.stages.json',
      application: 'application.stages.json',
    };

    cy.initMock(fixtureDir, startStage, configFiles);

    cy.get('[data-cy="row"]')
      .should('have.length', 5)
      .each((row, index) => {
        cy.wrap(row)
          .find('[data-cy="title"]')
          .should('contain', list[index].title);

        cy.wrap(row)
          .find('[data-cy="value"]')
          .should('contain', list[index].value);
      });

    cy.get('[data-cy="hr"]').should('have.length', 2);
  });
});
