import Ember from 'ember';
import layout from '../templates/components/aw-datatable-body';

const {
	Component,
	computed,
	get,
	set
} = Ember;

export default Ember.Component.extend({
  layout,
	tagName: 'td',

	classNameBindings: ['itemClass'],

	itemClass: computed.oneWay('column.className'),

	isComponent: computed.notEmpty('column.component'),

	isElement: computed.notEmpty('column.elements'),

	isCounter: computed.equal('column.key', 'COUNTER'),

	isCheckBox: computed.alias('column._isCheckbox'),

	isText: computed('isElement,isComponent,isCounter', function(){
		return ( !get( this , 'isElement' ) && !get( this , 'isComponent' ) && !get( this , 'isCounter' ) );
	}),

	isExpand: computed.equal('column.key', 'EXPAND'),

	elements: computed.oneWay('column.elements'),

	prefix: computed.oneWay('column.prefix'),
	suffix: computed.oneWay('column.suffix'),

	output: computed('data', 'column', function(){
		let column = get(this , 'column'),
		data = get(this , 'data'),
		parent = get(this, 'parent'),
		output='',
		_data;


		/* return empty if can find property on data object*/
		if ( Ember.typeOf(data) === 'undefined' ) {
			return output;
		}

		_data = get( data , column.key );


		if ( Ember.typeOf(column.render) === 'function' ) {


			let render = column.render;
			output = render(_data , column , parent.outputData( data ) );


		}else if ( Ember.typeOf( _data ) === 'boolean' ) {
			

			/* return exact boolean */
			return _data;


		}else if ( Ember.typeOf(_data) === 'undefined' ) {


			/* return empty if can find property on data object*/
			return output;


		}else{


			if ( column.display ) {
				let _display = column.display;
				_data = display(_data , _display );
			}
			output = Ember.String.htmlSafe( _data );


		}
		return output;
	}),

	click(){
		let expandable = get(this, 'parent.options.expandable');

		if ( get(this, 'isExpand') || ( expandable && expandable.rowExpanded ) ) {
			this.send('onToggleExpand');
		}
	},

	actions:{
		onClick(action){

			let data = get(this , 'data' );
			this.sendAction('action_name', action , data );
		},
		onToggleExpand(){
			
			let data = get(this , 'data');
			if ( data ) {
				set( data , '_expand' , !get(this , 'data._expand') );
				this.notifyPropertyChange('data');
			}
		}
	}
});

const display = function( _data , _display ){


	if ( typeof _display === 'string' ) {
		_display = {
			type: _display
		};
	}

	switch( _display.type ){
		case 'datetime':
			_data = _displayDateTime(_data , _display.format );
			break;
		case 'money':
			_data = _displayMoney(_data , _display.decimals, _display.decimal_sep, _display.thousands_sep );
			break;
		case 'toLowerCase':
			_data = _data.toLowerCase();
			break;
		case 'toUpperCase':
			_data = _data.toUpperCase();
			break;
	}

	return _data;
},
_displayDateTime = function( _data , _format ){
	if ( _data && _format ) {
		_data = moment( _data ).format( _format );
	}
	return _data;
},
_displayMoney = function( _data , decimals, decimal_sep, thousands_sep ){

	if ( _data && decimals && decimal_sep && thousands_sep ) {

		_data = (_data).toMoney( decimals , decimal_sep , thousands_sep );
	}
	return _data;
};





//http://stackoverflow.com/a/2866613/3828573
Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep){ 
   var n = this,
   c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
   d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

   /*
   according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
   the fastest way to check for not defined parameter is to use typeof value === 'undefined' 
   rather than doing value === undefined.
   */   
   t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

   sign = (n < 0) ? '-' : '',

   //extracting the absolute value of the integer part of the number and converting to string
   i = parseInt(n = Math.abs(n).toFixed(c)) + '', 

   j = ((j = i.length) > 3) ? j % 3 : 0; 
   return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
};




