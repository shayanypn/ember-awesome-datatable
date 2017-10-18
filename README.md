# Ember-Awesome-Datatable
 Powerful ember add-on to build tables, it's allow you to sort,search,filter,render, and customize your datatable easily.

[***Demo***](http://ember-datatable.shayanypn.ir/)


## Installation
`ember install ember-awesome-datatable`

OR

`ember install https://github.com/shayanypn/ember-awesome-datatable`


##Features
 - Filter
 - Search (local/ajax)
 - Ajax Handler
 - Column render(text,component,..)
 - column expanding
 - row number, checkbox
 - paging (local/ajax)
 - column show/hide
 - event callbacks
 -  and  what else do you want?? just create an issue. 

## Example

    // controller
    export default Ember.Controller.extend({
        init() {
            this.set('dataTableConfig',{
                table: {
                    className: 'table',
                    loading: ' Loading Text ... ',
                    empty: ' No element found ',
                },
                limit: -1,
                columns: [
                    'COUNTER: ',
                    {key: 'key1',label: 'Key1'},
                    {key: 'key2',label: 'Key2'},
                    {key: 'key3',label: 'Key3'
                    }
                ],
                data: [
                    {key1:'value1',key2:'value2',key3:'value3'},
                    {key1:'value1',key2:'value2',key3:'value3'},
                    {key1:'value1',key2:'value2',key3:'value3'},
                    {key1:'value1',key2:'value2',key3:'value3'}
                ],
            });
        },
        ..


    // template
    {{aw-datatable
        options=dataTableConfig
        }}



## Contributing
If you find an issue or missing functionality, please don't hesistate to open a pull request.

### Installation
* `git clone https://github.com/shayanypn/ember-awesome-datatable` 
* `npm install`
* `bower install`

### Running
* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests
* `npm test`

### Building
* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).


    

