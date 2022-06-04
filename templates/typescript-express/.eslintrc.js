module.exports = {
	env: {
		"es2021": true,
		"node": true,
	},
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: [
		"@typescript-eslint",
	],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
	],
	rules: {
		"indent": [
			"error",
			"tab"
		],
		"quotes": ["error", "double", { "allowTemplateLiterals": true }],
		"no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
	}
}
