import Ember from 'ember';

export default Ember.Controller.extend({
	log: Ember.A([]),
	init() {
		let self = this;

		
		this.set('dataTableConfig',{
			table: {
				className: 'table table-striped table-hover',
				// parent:{
				// 	tagName: 'div',
				// 	className: 'table-responsive',
				// },
				loading: ' Loading Text ... ',
				empty: ' No element found ',
				// scrollY: 		"200px",
				// scrollX:  		true
				// scrollCollapse: true,
			},
			order: 'first_name:asc',  // default order should be a key of selected columns
			paging:{
				pageNum: true,
				tagName: 'nav',
				className: 'nav',
				next: {
					enable: true,   /* ID show next page button or not */
					disable: true,  /* Enable/Disable of next page button or not */
					process: 'replace',   /* ::append,replace, function(){} */
					// text: ' next page ',  /* text of next page button */
					/*
					*  @ajax request
					*  return the 'data' attribute on options object
					*/
					ajax: function( current_page, options){
						let data = options.data;
						// data.queryParams['page'] = current_page+1;
						data['data'] = JSON.stringify({
							pageReq: 	'NEXT',
							pageSize: 	5,
							pagingStatus: self.get('tt')
						});
						return data;
					}
				},
				prev: {
					enable: true,
					disable: true,
					process: 'replace', // append,replace, function(){}
					/*
					*  @ajax request
					*  return the 'data' attribute on options object
					*/
					ajax: function( current_page, options){
						let data = options.data;
						// data.queryParams['page'] = current_page+1;

						data['data'] = JSON.stringify({
							pageReq: 	'BACK',
							pageSize: 	5,
							pagingStatus: self.get('tt')
						});

						return data;
					}
				},
				num:  {
					// enable: true,
					// process: 'append',
					// ajax: function( current_page, page_clicked, options){return data;}
				}
			},
			search:{
				/*
				*  @ajax request
				*  return the 'data' attribute on options object
				*/
				// ajax: function( query, options){
				// 	let data = options.data;
				// 	data.queryParams['query'] = query;
				// 	return data;
				// }
			},

			limit: -1, 
			// limit: 5,
			holdCheckedItem: true,

			// expandable: {
			// 	enable: false,
			// 	rowExpanded: true,
			// 	render( data ){
			// 		return Ember.String.htmlSafe( `<pre>${JSON.stringify( data, null, 3)}</pre>` );
			// 	},
			// 	// component: 'component-status'
			// },

			// columns: 'COUNTER: ,uuid,name:Name,meta.thing_id:Info',
			columns: [
				'COUNTER: ',
				'CHECKBOX: ',
				{
					key: 'icon',
					label: 'Icon',
					render(output){
						return Ember.String.htmlSafe( `<img src="${output}" />` );
					}
				},
				'first_name:First Name:true',
				'last_name:Last Name:true',
				{
					key: 'meta.user',
					label: 'Username',
					// render(output,column,data){
					// 	return `${output.user} ${output.name}`;
					// },
					display: 'toLowerCase'
				},
				{
					key: 	'enabled',
					label: 	'Status ',
					component: 'component-status'
					// order: true
				},
				{
					key: 'cost',
					label: 'Cost',
					prefix: '$',
					suffix: 'ریال',
					display: {
						type: 	'money',
						decimals: 2,
						decimal_sep: '.',
						thousands_sep: ','
					}
				},
				{
					key: 'updatedAt',
					label: 'Last Update',
					order: true,
					display:{
						type: 'datetime',
						format: 'YYYY/MM/DD'
					}
				},
				{
					key: 	'id',
					label: 	' ',
					className: 'td-action text-center',
					elements: [
						{
							tagName: 'div',
							className: 'btn-group',
							text: '',
							elements: [
								{
									tagName: 'button',
									className: 'btn btn-primary btn-xs',
									action: 'onEdit',
									elements:[
										{
											tagName: 'i',
											className: 'glyphicon glyphicon-pencil'
										}
									]
								},
								{
									tagName: 'button',
									className: 'btn btn-primary btn-xs',
									text: '<i class="glyphicon glyphicon-trash"></i>',
									action: 'onDelete'
								},
								{
									tagName: 'button',
									className: 'btn btn-primary btn-xs',
									text: '<i class="glyphicon glyphicon-eye-open"></i>',
									action: 'onView'
								}
							]
						}
					]
				}
			],
			// data: [    //array of data
			// 	{key1:'value1',key2:'value2',key3:'value3'},
			// 	{key1:'value1',key2:'value2',key3:'value3'},
			// 	{key1:'value1',key2:'value2',key3:'value3'},
			// 	{key1:'value1',key2:'value2',key3:'value3'}
			// ],
			// data: `http://localhost/test/Ember/data-table/public/api.php`,
			data: {  	// ajax advance
				// url:    		'http://web002.dominaterfid.com:8081/v0/project/5adf8e4b-097a-4675-9f6c-26d03dcd9ce6/oplog',
				url: 		`http://ember-datatable.shayanypn.ir/api.php`,
				method: 		`POST`,
				dataType: 		'json',
				contentType: 	'application/json',
				// beforeSend: function( xhr ){
				// 	// xhr.setRequestHeader('Authorization', 'ede27fe4-6192-4c18-8b06-e36f58c07687' );
				// },
				readPath: 'results',
				data: JSON.stringify({
					// pageReq: 	'NEXT',
					pageSize: 	5,
					// pagingStatus: some value
				}),
				// queryParams: {
				// 	limit: 5,
				// 	page: 1,
				// 	param_a: 'v_a',
				// 	param_b: 'v_b'
				// },
				// map( data ){
				// 	return data;
				// },
				// response(response , options){
				// 	return response;
				// }
			}, 
			events:{
				didInsertElement(){
					self.log.addObject('didInsertElement');
					// console.log('didInsertElement');
				},
				didRender(){
					self.log.addObject('didRender');
					// console.log('didRender');
				},

				willSort(){
					self.log.addObject('willSort');
					// console.log('willSort');
				},
				didSort(){
					self.log.addObject('didSort');
					// console.log('didSort');
				},

				willSearch(){
					self.log.addObject('willSearch');
					// console.log('willSearch');
				},
				didSearch(){
					self.log.addObject('didSearch');
					// console.log('didSearch');
				},

				willPaging(){
					self.log.addObject('willPaging');
					// console.log('willPaging');
				},
				didPaging(){
					self.log.addObject('didPaging');
					// console.log('didPaging');
				},
			}
		});
	},
	actions:{
		onReload(){
			this.dataTableConfig.methods.refresh();
		},
		onSearch(){
			let query = document.getElementById('query-name').value;

			this.dataTableConfig.methods.search( query ? query : '');
		},
		toggleColumn(column){
			this.dataTableConfig.methods.column({
				key: column
			}, 'toggle');
		},
		onPage(option){
			this.dataTableConfig.methods.page( option );
		},
		onLimit(option){
			this.dataTableConfig.methods.limit( option );
		},
		onNotifyChecked(){
			this.dataTableConfig.methods.notifyComponent('checked','sample-call','do-some-action');
		},
		// onEdit( item ){
		// 	console.log(`Action Edit called on item width id item.id` ,  'Action Edit');
		// },
		// onView( item ){
		// 	console.log(`Action View called on item width id item.id` ,  'Action View');
		// },
		// onDelete( item ){
		// 	console.log(`Action Delete called on item width id item.id` ,  'Action Delete');
		// }
	}
});
