/* eslint-env node */
module.exports = {
    description: 'An ember-cli addon that allows you to quickly, easily and powerfully build tables views.',

    normalizeEntityName: function() {},
    afterInstall: function() {
        return this.addBowerPackagesToProject([
          { name: 'moment' }
        ]);
    }
};
