import createCicaGa from '../modules/ga';
import {createAutocomplete} from '../modules/autocomplete/autocomplete';

(() => {
    const cicaGa = createCicaGa(window);
    cicaGa.setUpGAEventTracking();

    const autocomplete = createAutocomplete(window);
    autocomplete.init('.govuk-select');
})();
