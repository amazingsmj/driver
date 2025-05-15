(function () {
    'use strict';

    angular.module('driver.state', [
        'ase.resources',
        'rt.debounce',
        'driver.resources',
        'LocalStorageModule',
        'ui.router'
    ]);

})();