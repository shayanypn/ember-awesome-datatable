import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('aw-datatable-element', 'Integration | Component | aw datatable element', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{aw-datatable-element}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#aw-datatable-element}}
      template block text
    {{/aw-datatable-element}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
