/* eslint-disable func-names */
/* eslint-disable no-loop-func */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-destructuring, no-var  */

/**
 * Logs an event with Google Universal Analytics
 * when an external, download, or non http(s), link is clicked.
 *
 * Supports IE6+, Firefox, Chrome, Safari, Opera, and any other standards based browser.
 *
 * Does not track links that the user opens with the right-click context menu e.g. "Open Link in New Tab".
 *
 * If present, does not currently replicate target="_blank" when opening links.
 *
 * @method guaTrackLinks
 * @requires gtag.js
 * @param domain {String} current domain, can be as specific as required e.g.
 *
 * Given the current domain is "http://www.yoursite.co.uk"
 *
 * setting domain to "yoursite.co.uk" would work as follows:
 * http://www.yoursite.co.uk = Internal
 * https://www.yoursite.co.uk/index.html = Internal
 * http://yoursite.co.uk = Internal
 * https://subdomain.yoursite.co.uk = Internal
 * https://subdomain.yoursite.co.uk/index.html = Internal
 *
 * setting domain to "subdomain.yoursite.co.uk" would work as follows:
 * http://www.yoursite.co.uk = External
 * https://www.yoursite.co.uk/index.html = External
 * http://yoursite.co.uk = External
 * https://subdomain.yoursite.co.uk = Internal
 * https://subdomain.yoursite.co.uk/index.html = Internal
 *
 * @param window {Object} window object
 */
// eslint-disable-next-line no-unused-vars
function guaTrackLinks(domain, window) {
    var document = window.document;
    var body = document.body;
    var anchor = document.createElement('a');
    var isQualifiedURL;
    var rDownloads = /.+\.(?:zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|mp4|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;

    // set the test anchor's href to a relative url "a".
    anchor.href = 'a';

    // if the href is still "a" when accessed then the browser doesn't return fully qualified URLs (probably IE <= 7).
    // e.g. should be "http://www.some-domain.co.uk/a" not "a".
    isQualifiedURL = anchor.href !== 'a';

    function handler(ev) {
        var node = ev.target || ev.srcElement;
        var href;
        var hrefNoQuerystring;
        var scheme;

        // click may have originated from an element within an anchor e.g.
        // <a href="index.html"><img src="logo.jpg" alt="Home" /></a>
        // walk up dom and check if target has a parent anchor
        while (node !== body) {
            if (node.nodeName.toLowerCase() === 'a' && node.href) {
                // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
                // https://msdn.microsoft.com/en-us/ie/ms536429(v=vs.94)
                // on dynamically created links with a relative path, IE 7 does not return a fully qualified URL for the href attribute
                // passing the 4 flag will get this
                href = isQualifiedURL ? node.href : node.getAttribute('href', 4);

                hrefNoQuerystring = href.split('?')[0];

                // get scheme from url e.g. http:, https:, mailto:, tel:, etc
                // http://en.wikipedia.org/wiki/URI_scheme
                scheme = href.slice(0, href.indexOf(':') + 1);

                // handle schemes
                if (scheme.indexOf('http') === 0) {
                    if (hrefNoQuerystring.indexOf(domain) === -1) {
                        scheme = 'external-link';
                    } else if (rDownloads.test(hrefNoQuerystring)) {
                        scheme = 'download-link';
                    } else {
                        // internal link and not a download, ignore it
                        break;
                    }
                }
                // will be called for relevant http(s) links and catch all for other schemes (mailto:, tel:, etc)
                window.gtag('event', 'click', {
                    event_category: scheme,
                    event_label: href,
                    event_callback: function() {
                        // eslint-disable-next-line no-param-reassign
                        window.location.href = href;
                    }
                });

                // stop default link click and let the GA hitCallback redirect to the link
                // eslint-disable-next-line no-unused-expressions, no-param-reassign
                ev.preventDefault ? ev.preventDefault() : (ev.returnValue = 0);

                break;
            } else {
                node = node.parentNode;
            }
        }
    }

    // attach listener to body and delegate clicks
    // eslint-disable-next-line no-unused-expressions
    body.addEventListener
        ? body.addEventListener('click', handler)
        : body.attachEvent('onclick', handler);
}

export default guaTrackLinks;
