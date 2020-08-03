function createNewWindowAnchors(elements) {
    if (elements && elements.length) {
        const defaultOptions = {
            directories: 'no',
            titlebar: 'no',
            toolbar: 'no',
            location: 'no',
            status: 'no',
            menubar: 'no',
            scrollbars: 'no',
            resizable: 'no',
            width: '500',
            height: '500'
        };
        elements.forEach(anchor => {
            let options;
            try {
                options = JSON.parse(anchor.getAttribute('open-new-window'));
            } catch (e) {
                options = {};
            }
            const combinedOptions = Object.entries({...defaultOptions, ...options})
                .map(x => `${x[0]}=${x[1]}`)
                .join(', ');

            anchor.addEventListener(
                'click',
                e => {
                    window.open(anchor.href, 'popupWindow', combinedOptions);
                    e.preventDefault();
                },
                false
            );
        });
    }
}

export default createNewWindowAnchors;
