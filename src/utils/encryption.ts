import bcrypt from 'bcryptjs';

/**
 * Encrypt a password
 * @param {string} password - The plain text password to encrypt.
 * @returns {Promise<string>} - The encrypted password.
 */
export const encryptPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 10; // Consider making this configurable
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    return encryptedPassword;
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (error) {
    throw new Error('Error encrypting password');
  }
};

/**
 * Check if the provided password matches the stored password
 * @param {string} password - The plain text password.
 * @param {string} userPassword - The hashed password from the database.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */
export const isPasswordMatch = async (password: string, userPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, userPassword);
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};
