import Ember from 'ember';

export default Ember.Component.extend({
	isLoading: false,
	didNotify: Ember.computed('notify', function(){
		if ( this.get('virtualAction') == 'sample-call') {
			this.SampleCall();
		}
		return true;
	}),
	SampleCall(){
		let self = this;
		this.set('isLoading', true);
		setTimeout(()=>{
			self.set('isLoading', false);
		} , 2000 );
	}
});
