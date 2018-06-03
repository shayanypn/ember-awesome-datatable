import Ember from 'ember';
import layout from '../templates/components/aw-datatable-expand';

const {
	Component,
	computed,
	get,
} = Ember;

export default Component.extend({
  layout,
	tagName: 'tr',

	isComponent: computed.notEmpty('expand.component'),

	isText: computed.not('isComponent'),

	isExpand: computed.and('expand.enable', 'data._expand'),

	output: computed('data,expand', function(){
		let column = get(this , 'expand'),
		data = get(this , 'data'),
		output='';


		/* return empty if can find property on data object*/
		if ( Ember.typeOf(data) === 'undefined' ) {
			return output;
		}

		if ( column.render ) {
			let render = column.render,
			parent = get(this, 'parent');
			output = render( parent.outputData(data) );
		}

		return output;
	}),
});
