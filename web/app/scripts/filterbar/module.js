(function () {
    'use strict';

    /* ngInject */
    function DirectiveConfig() {
    }

    angular.module('driver.filterbar', [
        'ase.auth',
        'rt.debounce',
        'driver.resources',
        'driver.state',
        'driver.localization',
        'ui.bootstrap'
    ]).config(DirectiveConfig);

})();
