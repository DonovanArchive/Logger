/**
 * Sanitize console output to remove special characters.
 *
 * @static
 * @param {string} str - The string to sanitize-
 * @returns {string}
 * @memberof Internal
 * @example Internal.consoleSanitize("someString");
 */
export function consoleSanitize(str: string) {
	if (typeof str !== "string") str = (str as string).toString();
	// eslint-disable-next-line no-control-regex
	return str.replace(/\u001B\[[0-9]{1,2}m/g, "");
}

/**
 * first letter of every word uppercase.
 *
 * @static
 * @param {string} str - The string to perform the operation on.
 * @returns {string}
 * @memberof Strings
 * @example Strings.ucwords("some string of words");
 */
export const ucwords = (str: string) => str.toString().toLowerCase().replace(/^(.)|\s+(.)/g, (r) => r.toUpperCase());
