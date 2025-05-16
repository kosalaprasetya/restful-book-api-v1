const jwt = require('jsonwebtoken');
const { signToken, verifyToken } = require('../lib/jwt');

describe('JWT Utility Functions', () => {
  const payload = { id: 'user123', role: 'admin' };
  const token = 'mocked.jwt.token';
  const jwtSecret = process.env.JWT_SECRET;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('signToken', () => {
    it('should call jwt.sign with payload and secret and return token', () => {
      const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token);

      const result = signToken(payload);

      expect(signSpy).toHaveBeenCalledWith(payload, jwtSecret);
      expect(result).toBe(token);
    });

    it('should throw if jwt.sign throws', () => {
      jest.spyOn(jwt, 'sign').mockImplementation(() => {
        throw new Error('sign error');
      });

      expect(() => signToken(payload)).toThrow('sign error');
    });

    it('should work with empty payload', () => {
      const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token);

      const result = signToken({});
      expect(signSpy).toHaveBeenCalledWith({}, jwtSecret);
      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should call jwt.verify with token and secret and return payload', () => {
      const verifySpy = jest.spyOn(jwt, 'verify').mockReturnValue(payload);

      const result = verifyToken(token);

      expect(verifySpy).toHaveBeenCalledWith(token, jwtSecret);
      expect(result).toBe(payload);
    });

    it('should throw if jwt.verify throws', () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('verify error');
      });

      expect(() => verifyToken(token)).toThrow('verify error');
    });

    it('should work with empty token', () => {
      const verifySpy = jest.spyOn(jwt, 'verify').mockReturnValue(payload);

      const result = verifyToken('');
      expect(verifySpy).toHaveBeenCalledWith('', jwtSecret);
      expect(result).toBe(payload);
    });
  });
});