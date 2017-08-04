import Ember from 'ember';
import layout from '../templates/components/aw-datatable';

const {
	Component,
	computed,
	get,
	set
} = Ember,
cptlzFL = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}, _clone = function(obj) {

	if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj) {
		return obj;
	}
	var temp;

	if (obj instanceof Date) {
		temp = new obj.constructor();
	} else {
		temp = obj.constructor();
	}
	
	for (var key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			obj['isActiveClone'] = null;
			temp[key] = _clone(obj[key]);
			delete obj['isActiveClone'];
		}
	}
	return temp;
};



export default Ember.Component.extend({
  layout,
	_isValid: true,

	firstOption: null,

	_data: Ember.ArrayProxy.create({content: []}),

	_columns: Ember.ArrayProxy.create({content: []}),

	_limit: 10,
	_page: 1,


	init() {
		this._super(...arguments);


		let options = get(this, 'options');
		set(this, 'options' , options ? options : {});


		Ember.run.scheduleOnce('afterRender', this, ()=> {
			this.initial();
		});
	},


	isNotValid: computed.not('_isValid'),

	_className: computed.oneWay('options.table.className'),


	columnCount: computed('_columns.@each', function(){

		return get(this._columns , 'content.length');
	}),

	/*************************\
		ITEM SELECT
	\*************************/
	itemCheckedCount: computed('_data.@each._checked', function(){
		let checked_data = get(this, '_data').filterBy('_checked' , true),
		_columns = this._columns.filterBy('_isCheckbox' , true );

		this.onEvent('itemChecked', this);

		if ( checked_data.length === get(this, '_data.content').length && get(this, '_data.content').length > 0 ) {
			_columns.forEach( item => {
				set( item , '_checked', true );
			});

			this.onEvent('CheckedAll', this);

		}else{
			_columns.forEach( item => {
				set( item , '_checked', false );
			});
		}

		return checked_data.length;
	}),
	itemChecked: computed('_data.@each._checked', function(){
		return get(this, '_data').filterBy('_checked' , true);
	}),


	/*************************\
		TEXT
	\*************************/
	textLoading: computed('options.table.loading', function(){
		let text = get(this, 'options.table.loading' );

		return Ember.String.htmlSafe( text ? text : ' Loading ... ' );
	}),


	textNoItem: computed('options.table.empty', function(){
		let text = get(this, 'options.table.empty' );

		return Ember.String.htmlSafe( text ? text : ' No item found! ' );
	}),
	

	/*************************\
		SEARCH
	\*************************/
	/*
	* @search
	* if option has ajax search do it, if not, do local search
	*/
	_searchQuery: '',
	onSearch(query){
		let options = get(this, 'options'),
		search = options.search;

		if ( search && Ember.typeOf(search.ajax) === 'function' ) {

			/* search ajax: return the request configuration */
			let fn = options.search.ajax,
			data_options = fn( query, options );

			this.ajaxSearch( data_options );

		}else{

			set( this , '_searchQuery' , query );
		}

		/* reset active page */
		set( this , '_page' , 1);
	},
	_searchedData: computed('_searchQuery', '_data.@each', function(){
		let query = get(this, '_searchQuery').toLowerCase(),
		data = get(this, '_data'),
		searched_data = ( query === '' ) ? data : data.filter( item => item.search_text.match( query ) );

		if ( query !== '' ){
			this.onEvent('didSearch', this);
		}

		return searched_data;
	}),


	/*************************\
		SORT
	\*************************/
	_sortedData: computed.sort('_searchedData', '_sortDefinition'),
	_sortDefinition: computed( '_columns.@each.{_ordering,_order_asc}' , function() {
		let column_order =  get( this , '_columns' ).filterBy('_ordering', true);

		return column_order.map( column => `${column.key}:${(column._order_asc ? 'asc' : 'desc' )}` );
	}),


	/*************************\
		DATA
	\*************************/
	_dataRow: computed( '_sortedData', '_data.@each', '_page' , function() {
		let data = get(this, '_sortedData'),
		paging = get(this , 'options.paging') ? get(this , 'options.paging') : {},
		limit = get(this , '_limit'),
		page = get(this , '_page'),
		limited_data = [],
		data_length = data.length,
		is_ajax_paging = false;

		if (
				paging &&
				(
					(paging.next && Ember.typeOf(paging.next.ajax) === 'function') || 
					(paging.prev && Ember.typeOf(paging.prev.ajax) === 'function')
				)
			){
			is_ajax_paging = true;
		}



		if ( get(this, '_sortDefinition.length') ) {
			this.onEvent('didSort', this);
		}

		/* return empty if these is no data */
		if ( data_length === 0 ) { return []; }

		/* return all data if limit equal -1  */
		if ( limit === -1 ) { return data; }


		for (var i = 0; i < limit; i++) {
			let index = is_ajax_paging ? i : ( ( page - 1 ) * limit + i );
			if ( index < data_length ) {
				limited_data.push(  index );
			}
		}

		return data.objectsAt(limited_data);
	}),



	isPaging: computed.alias('options.paging'),
	_pagination: computed('_dataRow' , '_limit' , '_page' , function(){


		
		let paging = get(this , 'options.paging') ? get(this , 'options.paging') : {},
		page_num = Math.ceil( get(this, '_sortedData.length') / get(this , '_limit') ),
		pages,
		_pages_page = [],
		_page = get(this, '_page'),
		next_disable = false,
		prev_disable = false;


		for (let i = 1; i <= page_num ; i++) {
			_pages_page.push({
				num: i,
				active: ( _page === i ? true : false )
			});
		}
		pages = Ember.ArrayProxy.create({content: _pages_page });


		/*
		* NEXT Button
		*/
		next_disable = ( _page !== page_num ? true : false );
		if ( paging.next && paging.next.disable ) {
			next_disable = true;
		}else if( paging.next && paging.next.disable === false ){
			next_disable = false;
		}

		
		/*
		* PREV Button
		*/
		prev_disable = ( _page !== 1 ? true : false );
		if ( paging.prev && paging.prev.disable ) {
			prev_disable = true;
		}else if( paging.prev && paging.prev.disable === false ){
			prev_disable = false;
		}

		

		return Ember.Object.create({
			tagName: 	( paging.tagName ? paging.tagName : 'nav' ),
			className: 	( paging.className ? paging.className : '' ),
			pages: pages,
			next_disable: next_disable,
			prev_disable: prev_disable,
		});
	}),


	/*************************\
		COLUMN
	\*************************/
	_dataColumn: computed('_columns.@each.{_ordering,_order_asc,_isShow}', function(){
		return get( this , '_columns')
		.filterBy('_isShow' , true)
		.map( column => {

			/*
			* Specify column class
			*/
			let _class = '';
			_class += column.order ? 'sorting' : '';
			_class += ( column.order && column._ordering && column._order_asc ) ? ' sort-asc' : '';
			_class += ( column.order && column._ordering && !column._order_asc ) ? ' sort-desc' : '';
			set( column , '_class' , _class );

			return column;
		});
	}),


	/*********\
	 ********* Initial 
	\*********/
	initial(){
		let self = this,
		options = get(this, 'options');

		set(this, 'firstOption', options);


		/*
		* Initial methods
		*/
		set(this.options , 'methods' , Ember.Object.create({
			refresh: () => {
				self.send('methodRefresh');
			},
			search: query=>{
				if ( Ember.typeOf(query) !== 'string' ) {
					console.error('Search query should be string');
					return;
				}
				self.onSearch( query );
			},
			column: (option, status) => {
				option = ( Ember.typeOf(option) === 'string' ) ? { key: option } : option;
				status = ( Ember.typeOf(status) === 'undefined' ) ? 'show' : status;
				self.send( 'methodColumn' ,  option , status);
			},
			page: option => {
				self.send( 'methodPage' ,  option );
			},
			limit: option => {
				self.send( 'methodLimit' ,  option );
			},
			reInit: fn =>{
				if ( Ember.typeOf(fn) === 'function') {
					let options = fn( get(self , 'options' ) );
					if ( Ember.typeOf(options) === 'object') {
						self.set('options' , options );
					}
				} else if ( Ember.typeOf(options) === 'object'){
					self.set('options' , options );
				}else{
					console.error('error on re-intial');
					return false;
				}
				self.initial();
			},
			getCheckedData(){
				let data = [];
				get(self, 'itemChecked')
				.forEach(item =>{
					data.push( self.outputData(item) );
				});
				return data;
			}
		}));


		set(this, '_limit', options.limit ? options.limit : 10 );





		/* Call BeforeRender Event */
		this.onEvent('beforeRender', this);




		this.initialData( true );
	},


	/*********\
	 ********* Initial Data
	\*********/
	initialData(){
		let self = this,
		options = get(this,'firstOption');


		// set(this , '_isLoading' , true );

		this.doData( options.data )
		.then( resolve => {

			set(self , '_data.content', resolve);


			self.initialColumns();

		}, reason => {

			console.log('on rejection' , reason );

			// set(self, '_isLoading' , false );
			set(self, '_isValid'   , false );
		});
	},


	/*********\
	 ********* Initial Column
	\*********/
	initialColumns(){
		let self = this,
		options = get(this, 'options');


		if ( Ember.isArray( options.columns ) ) {

			let _columns = options.columns
			.map( column =>{

				if ( Ember.typeOf(column) === 'string' ) {
					let _column = column.split(':');
					column = {
						key: _column[0],
						label: _column[1] ? _column[1] : cptlzFL( _column[0] ),
						order: _column[2] ? true : false
					};
				}

				return Ember.Object.create(column);
			});

			set( this._columns , 'content' , _columns );


		}else if( Ember.typeOf( options.columns ) === 'string' ){


			options.columns.split(',')
			.forEach( column => {
				let _column = column.split(':');
				self._columns.addObject(Ember.Object.create({
					key: _column[0],
					label: _column[1] ? _column[1] : cptlzFL( _column[0] ),
					order: _column[2] ? true : false
				}));
			});
		}else{

			/* none array columns , get column from data property */
			let columns = Object.keys( get( this._data , 'firstObject') );

			columns.forEach( column =>{
				self._columns.addObject(Ember.Object.create({
					key: column,
					label: cptlzFL( column )
				}));
			});
		}


		/*
		*  visible all columns
		*/
		this._columns.setEach('_isShow', true);


		/*
		* check Default ordering
		*/
		if ( get(this, 'options.order') ) {
			
			let order = get(this, 'options.order').split(':'),
			columns = this._columns.findBy('key' , order[0] );

			if ( columns ) {

				set(columns , '_ordering'  , true );
				set(columns , '_order_asc' , ( order[1] && order[1] === 'asc' ) ? true : false  );
			}
		}


		/*
		* Check if any column has checkbox
		*/
		if ( get(this, '_columns').length ) {
			
			get(this, '_columns')
			.filterBy('key','CHECKBOX')
			.forEach( item => {
				set(item , '_isCheckbox', true);
				set(item , '_checked'   , false);
			});
		}


		/* Call AfterRender Event */
		this.onEvent('afterRender', this);

		set(this, '_isLoading' , false );
	},


	doData( options_data ){
		let self = this,
		options = get(this, 'options'),
		promise = new Promise( (resolve, reject) => {

			set(self , '_isLoading' , true );


			/*------------------------------------------*\
			\*----  data is pass to table as array  ----*/
			if ( Ember.isArray(options_data) ) {

				let data = self.mapData( options_data );


				// on success
				resolve(  data );
				set(self , '_isLoading' , false );

			/*------------------------------------------*\
		     *----  url pass for http get call      ----*
			\*---- http config pass for http call   ----*/
			}else if(
				( Ember.typeOf(options_data) === 'string' ) ||
				( Ember.typeOf(options_data) === 'object' )
			){


				let ajax_option = Ember.typeOf(options_data) === 'object' ? options_data : { url: options_data },
				ajax_map = Ember.typeOf(options_data.map) === 'function' ? options_data.map : null,
				ajax_response = Ember.typeOf(options_data.response) === 'function' ? options_data.response : null;

				self._getAjaxData( ajax_option )
				.then(function( ajax_data ) {
					// on fulfillment

					let read_path = ajax_option.readPath ? ajax_option.readPath : '',
					data = ( read_path === '' ) ? ajax_data : get( ajax_data , read_path );


					if ( ajax_response !== null ) {
						data = ajax_response(data, options);
					}



					if ( !data ) {
						console.error('data in null');
						reject( false );
					}




					if ( ajax_map !== null ) {
						data = data.map( ajax_map );
					}



					if ( !data ) {
						console.error('data in null');
						reject( false );
					}


					data = self.mapData( data );


					if ( !data ) {
						console.error('data in null');
						reject( false );
					}



					resolve( data );
					set(self , '_isLoading' , false );

				}, function(reason) {
					// on rejection

					console.log('on rejection' , reason );
				});

			/*------------------------------------------*\
			\*----    invalid data format  ----*/
			}else{
				// on failure
				reject( false );
				set(self , '_isLoading' , false );
			}
		});
		return promise;
	},


	/*
	* map entry data before rendering
	*/
	mapData( datas ){
		return datas.map(item => {

			set( item , 'search_text' , JSON.stringify(item).toLowerCase() );

			set( item , '_expand' , false );
			set( item , 'isExpand' , function(){
				return get(this, '_expand') ? true : false;
			});

			return item;
		});
	},


	outputData( data ){

		let clone_data = _clone( data );
		delete clone_data.search_text;
		delete clone_data._expand;
		delete clone_data._checked;


		return clone_data;
	},


	ajaxSearch( search_ajax ){
		let self = this;

		set(this, '_isLoading' , false );

		set(self , '_data.content', [] );

		this.doData( search_ajax )
		.then( resolve => {

			set(self , '_data.content', resolve);
		}, reason => {

			console.log('on rejection' , reason );
			set(self, '_isLoading' , false );
			set(self, '_isValid' , false );
		});
	},


	ajaxPage( ajax_config , _process, page ){
		let self = this;

		set(this, '_isLoading' , false );

		if ( _process === 'replace' ) {
			set(self._data , 'content', [] );
		}


		this.doData( ajax_config )
		.then( resolve => {

			if ( Ember.typeOf(_process) === 'string') {

				set( self, '_page' , page );

				if ( _process === 'append' ) {
					self._data.addObjects( resolve );
				}

				if ( _process === 'replace' ) {

					set(self._data , 'content', resolve );
				}

				self.notifyPropertyChange('_page');
				self.notifyPropertyChange('_sortedData');
			}

		}, reason => {

			console.log('on rejection' , reason );
			set(self, '_isLoading' , false );
			set(self, '_isValid' , false );
		});
	},


	/*############################################################################*\
	\*############################################################################*/
	_getAjaxData(config){

		let _config = _clone( config );

		/* attach ajax queries to url */
		if ( _config.queryParams ) {
			let _query = Object.keys( _config.queryParams ).map( key =>{
				return key + '='+ _config.queryParams[ key ];
			}).join('&');
			_config.url +=  ( _query !== '' ) ? ('?' + _query) : '' ;
		}

		return new Promise( (resolve, reject) => {

			/*
			* execute the query command
			*/
			Ember.$.ajax(_config)
			.done( response => { resolve( response ); })
			.always( (jqXHR, text_status) => { reject(jqXHR, text_status); });
		});
	},


	onEvent( name , params ){
		let event = get(this , `options.events.${name}`);

		if ( event ) {

			return event(params);
		}
	},


	didRender(){
		/* Call DidRender Event */
		this.onEvent('didRender', this);
	},


	actions: {

		onCheckbox( column , ele ){
			let data = get(this , '_data');

			data.setEach('_checked' , ele.target.checked );
		},


		methodRefresh(){
			Ember.run.debounce( this, this.initialData, 200 );

			/* reset active page */
			set( this , '_page' , 1);

		},


		_onColumnSort( _data_column ){

			if ( !_data_column.order ) {return;}

			this.onEvent('willSort', this);

			let column = get(this, '_dataColumn').findBy( '_ordering' , true );

			if ( Ember.typeOf(column) === 'undefined' ) {
				set( _data_column , '_ordering'  , true );
				set( _data_column , '_order_asc' , true );

			}else if( ( column === _data_column ) && _data_column._order_asc ){
				set( _data_column , '_order_asc'  , false );


			}else if( ( column === _data_column ) && !_data_column._order_asc ){
				set( _data_column , '_ordering'  , false );


			}else{
				set( column , '_ordering'  , false );

				set( _data_column , '_ordering'  , true );
				set( _data_column , '_order_asc' , true );
			}

			/* reset active page */
			set( this , '_page' , 1);
		},



		methodColumn(column , mode){
			let _column;

			if ( Ember.typeOf(column.key) !== 'undefined') {
				let query_column = this._columns.findBy('key' , column.key );
				if ( query_column ) {
					_column = query_column;
				}
			}


			if ( _column ) {
				switch( mode ){
					case 'hide':
						set(_column , '_isShow' , false );
						break;
					case 'show':
						set(_column , '_isShow' , true );
						break;
					case 'toggle':
						_column.toggleProperty('_isShow');
						break;
				}
				this.notifyPropertyChange('_searchQuery');
			}
		},



		methodPage(_page){
			let options = get(this, 'options'),
			paging = options.paging,
			current_page = get( this, '_page'); 

			if ( Ember.typeOf(_page) === 'string' ) {

				if ( _page === 'next' && paging && paging.next && Ember.typeOf(paging.next.ajax) === 'function' ){ // call next ajax function

					let fn = paging.next.ajax,
					next_ajax = fn( current_page, options ),
					_process = paging.next.process ? paging.next.process : 'append';

					if ( next_ajax ) {

						this.ajaxPage( next_ajax , _process, current_page + 1 );
					}else{

						console.error('Error on setting page');
						return;
					}

				}else if ( _page === 'prev' && paging && paging.prev && Ember.typeOf(paging.prev.ajax) === 'function' ){ // call prev ajax function


					let fn = paging.prev.ajax,
					prev_ajax = fn( current_page, options ),
					_process = paging.prev.process ? paging.prev.process : 'append';

					if ( prev_ajax ) {

						this.ajaxPage( prev_ajax , _process, current_page - 1 );
					}else{

						console.error('Error on setting page');
						return;
					}

				}else{


					let pages = get(this , '_pagination.pages'),
					next_page = pages.findBy('num' , ( _page === 'prev' ) ? (current_page - 1) : (current_page + 1) );

					if ( !next_page ) {

						console.error('Error on setting page');
						return;
					}
					set( this, '_page' , next_page.num );
				}

			}else if ( Ember.typeOf(_page) === 'number' ) {


				let pages = get(this , '_pagination.pages'),
				next_page = pages.findBy('num' , _page );

				if ( !next_page ) {
					
					console.error('Error on setting page');
					return;
				}
				set( this, '_page' , next_page.num );

			}else if ( Ember.typeOf(_page) === 'object' && _page.num ) {


				set(this , '_page' , _page.num );
			}
		},



		methodLimit(limit){

			if ( Ember.typeOf(limit) === 'number') {
				set(this, '_limit', limit );
				this.notifyPropertyChange('_page');
			}
		},



		onChildAction( action_name , data ){
			
			if ( action_name && data) {
				set(this , '_action' , action_name );

				this.sendAction('_action' , data );
			}else{

				console.error('Can\'t find action');
			}
		}
	},


	didInsertElement(){

		/* Call didInsertElement Event */
		this.onEvent('didInsertElement', this);
	}
});