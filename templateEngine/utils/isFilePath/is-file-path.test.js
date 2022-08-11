'use strict';

const isFilePath = require('.');

const FILEPATHS = {
    FILE_NAME_WITH_EXTENSION: 'file.njk',
    FILE_NAME_WITH_EXTENSION_AND_PRECEDING_SLASH: '/file.njk',
    FILE_NAME_WITH_DASHES_WITH_EXTENSION: 'file-with-dash.njk',
    FILE_NAME_WITH_DASHES_WITH_EXTENSION_AND_PRECEDING_SLASH: '/file-with-dash.njk',
    DIR_NAME_WITH_FILE_NAME_WITH_EXTENSION: 'hello/file.log',
    DIR_NAME_WITH_FILE_NAME_WITH_EXTENSION_AND_PRECEDING_SLASH: '/hello/file.log',
    DIR_NAME: 'dir',
    DIR_NAME_WITH_PRECEDING_SLASH: '/dir',
    DIR_NAME_WITH_DIR_NAME: 'dir1/dir2',
    DIR_NAME_WITH_DIR_NAME_AND_PRECEDING_SLASH: '/dir1/dir2',
    DIR_NAME_WITH_DASHES_WITH_DIR_NAME: 'dir1-with-dash/dir2',
    DIR_NAME_WITH_DASHES_WITH_DIR_NAME_AND_PRECEDING_SLASH: '/dir1-with-dash/dir2',
    FILE_NAME_WITH_EXTENSION_WITH_DIR_NAME: 'dir.log/dir',
    FILE_NAME_WITH_EXTENSION_WITH_DIR_NAME_AND_PRECEDING_SLASH: '/dir.log/dir'
};

describe('isFilePath', () => {
    it('Should allow file path with file name with file extension', () => {
        const result = isFilePath(FILEPATHS.FILE_NAME_WITH_EXTENSION);
        expect(result).toBe(true);
    });

    it('Should allow file path with file name with file extension and preceding slash', () => {
        const result = isFilePath(FILEPATHS.FILE_NAME_WITH_EXTENSION_AND_PRECEDING_SLASH);
        expect(result).toBe(true);
    });

    it('Should allow file path with file name with dashes', () => {
        const result = isFilePath(FILEPATHS.FILE_NAME_WITH_DASHES_WITH_EXTENSION);
        expect(result).toBe(true);
    });

    it('Should allow file path with file name with dashes and preceding slash', () => {
        const result = isFilePath(
            FILEPATHS.FILE_NAME_WITH_DASHES_WITH_EXTENSION_AND_PRECEDING_SLASH
        );
        expect(result).toBe(true);
    });

    it('Should allow file path with dir name with file name', () => {
        const result = isFilePath(FILEPATHS.DIR_NAME_WITH_FILE_NAME_WITH_EXTENSION);
        expect(result).toBe(true);
    });

    it('Should allow file path with dir name with file name and preceding slash', () => {
        const result = isFilePath(
            FILEPATHS.DIR_NAME_WITH_FILE_NAME_WITH_EXTENSION_AND_PRECEDING_SLASH
        );
        expect(result).toBe(true);
    });

    it('Should not allow file path with dir name only', () => {
        const result = isFilePath(FILEPATHS.DIR_NAME);
        expect(result).toBe(false);
    });

    it('Should not allow file path with dir name and preceding slash only', () => {
        const result = isFilePath(FILEPATHS.DIR_NAME_WITH_PRECEDING_SLASH);
        expect(result).toBe(false);
    });

    it('Should not allow file path with dir name and dir name', () => {
        const result = isFilePath(FILEPATHS.DIR_NAME_WITH_DIR_NAME);
        expect(result).toBe(false);
    });

    it('Should not allow file path with dir name and dir name and preceding slash', () => {
        const result = isFilePath(FILEPATHS.DIR_NAME_WITH_DIR_NAME_AND_PRECEDING_SLASH);
        expect(result).toBe(false);
    });

    it('Should not allow file path with dir name with dashes and dir name', () => {
        const result = isFilePath(FILEPATHS.DIR_NAME_WITH_DASHES_WITH_DIR_NAME);
        expect(result).toBe(false);
    });

    it('Should not allow file path with dir name with dashes and dir name and preceding slash', () => {
        const result = isFilePath(FILEPATHS.DIR_NAME_WITH_DASHES_WITH_DIR_NAME_AND_PRECEDING_SLASH);
        expect(result).toBe(false);
    });

    it('Should not allow file path with file name with extension and dir name', () => {
        const result = isFilePath(FILEPATHS.FILE_NAME_WITH_EXTENSION_WITH_DIR_NAME);
        expect(result).toBe(false);
    });

    it('Should not allow file path with file name with extension and dir name and preceding slash', () => {
        const result = isFilePath(
            FILEPATHS.FILE_NAME_WITH_EXTENSION_WITH_DIR_NAME_AND_PRECEDING_SLASH
        );
        expect(result).toBe(false);
    });
});
