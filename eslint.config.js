const antfu = require('@antfu/eslint-config')

module.exports = antfu.default({
    react: true,
    stylistic: {
        indent: 4,
        quotes: 'single',
    },
    ignores: ['.next/**', 'pnpm-lock.yaml'],
    rules: {
        // write temporarily
        'react-hooks/exhaustive-deps': 'off',
    },
})
