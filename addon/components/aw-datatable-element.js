import Ember from 'ember';
import layout from '../templates/components/aw-datatable-element';

const {
	Component,
	computed,
	get,
	set
} = Ember;

export default Ember.Component.extend({
  layout,
	classNameBindings: ['itemClass'],

	itemClass: computed.oneWay('parent.className'),

	isElement: computed.notEmpty('parent.elements'),

	elements: computed.oneWay('parent.elements'),

	click(){
		let grandParent = get( this , 'grandParent' ),
		action = get(this,'parent.action');

		if ( action ) {

			grandParent.send('onClick' , action );
		}
	}
});
