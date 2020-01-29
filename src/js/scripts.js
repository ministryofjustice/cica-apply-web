import createCicaGa from '../modules/ga';

(() => {
    const cicaGa = createCicaGa(window);
    cicaGa.setUpGAEventTracking();
})();