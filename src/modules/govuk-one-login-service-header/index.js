import CrossServiceHeader from '../../../components/govuk/one-login-service-header/service-header';

function createCrossServiceHeader(window) {
    const oneLoginHeader = window.document.querySelector('[data-module="one-login-header"]');
    if (oneLoginHeader) {
        new CrossServiceHeader(oneLoginHeader).init();
    }
}

export default createCrossServiceHeader;
