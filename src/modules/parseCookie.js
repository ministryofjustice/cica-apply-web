const parseCookie = raw => {
    try {
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
};

export default parseCookie;
