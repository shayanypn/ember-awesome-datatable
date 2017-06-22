import Ember from 'ember';

export function awDatatableCounter(params/*, hash*/) {
	let num = params[0],
	page = params[1],
	limit = ( params[2] === -1 ) ? 0 : params[2];

	return ( ( page - 1 ) * limit + num ) + 1;
}

export default Ember.Helper.helper(awDatatableCounter);