import Ember from 'ember';
import layout from '../templates/components/aw-datatable-paging';

const {
	Component,
	computed,
	get,
} = Ember;

export default Component.extend({
  layout,

	isPageNum: computed('pagination' , function(){
		let paging = get(this , 'options.paging') ? get(this , 'options.paging') : {};
		return ( paging.pageNum === false ) ? false : true ;
	}),
	
	pageNumbers: computed.alias('pagination.pages'),

	isNextPage: computed('pagination' , function(){
		let paging = get(this , 'options.paging') ? get(this , 'options.paging') : {};
		return ( paging.next && paging.next.enable === false ) ? false : true;
	}),

	isPrevPage: computed('pagination' , function(){
		let paging = get(this , 'options.paging') ? get(this , 'options.paging') : {};
		return ( paging.prev && paging.prev.enable === false ) ? false : true;
	}),

	actions:{
		onPage( page ){

			if ( page === 'prev' && get(this, 'pagination.prev_disable') ) {
				return;
			}

			if ( page === 'next' &&  get(this, 'pagination.next_disable') ) {
				return;
			}

			this.sendAction('onPage' , page);
		}
	}
});
