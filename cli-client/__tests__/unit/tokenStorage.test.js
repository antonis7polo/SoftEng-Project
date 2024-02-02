jest.mock('fs');

const fs = require('fs');
const path = require('path');
const { storeToken, getToken, clearToken } = require('../../src/utils/tokenStorage');

describe('tokenStorage', () => {
    const mockToken = '12345';
    const tokenFilePath = path.join(__dirname, '../../src/utils/.token');

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks between tests
    });

    describe('storeToken', () => {
        it('writes the token to the file', () => {
            storeToken(mockToken);
            expect(fs.writeFileSync).toHaveBeenCalledWith(tokenFilePath, mockToken, 'utf8');
        });
    });

    describe('getToken', () => {
        it('returns the token if the file exists', () => {
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(mockToken);
            
            const token = getToken();
            expect(fs.existsSync).toHaveBeenCalledWith(tokenFilePath);
            expect(fs.readFileSync).toHaveBeenCalledWith(tokenFilePath, 'utf8');
            expect(token).toEqual(mockToken);
        });

        it('returns null if the file does not exist', () => {
            fs.existsSync.mockReturnValue(false);
            
            const token = getToken();
            expect(fs.existsSync).toHaveBeenCalledWith(tokenFilePath);
            expect(token).toBeNull();
        });
    });

    describe('clearToken', () => {
        it('deletes the token file if it exists', () => {
            fs.existsSync.mockReturnValue(true);
            
            clearToken();
            expect(fs.existsSync).toHaveBeenCalledWith(tokenFilePath);
            expect(fs.unlinkSync).toHaveBeenCalledWith(tokenFilePath);
        });

        it('does nothing if the file does not exist', () => {
            fs.existsSync.mockReturnValue(false);
            
            clearToken();
            expect(fs.existsSync).toHaveBeenCalledWith(tokenFilePath);
            expect(fs.unlinkSync).not.toHaveBeenCalled();
        });
    });
});
