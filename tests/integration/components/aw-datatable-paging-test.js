import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('aw-datatable-paging', 'Integration | Component | aw datatable paging', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{aw-datatable-paging}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#aw-datatable-paging}}
      template block text
    {{/aw-datatable-paging}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
