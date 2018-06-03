
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('aw-datatable-counter', 'helper:aw-datatable-counter', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{aw-datatable-counter inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

