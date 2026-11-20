# Publishing the Template

This page is for maintainers of `@umang-thakkar/base-template`.

## Repository layout

```
base-template/
├── package.json         # The npm package (name, version, "files")
├── template.config.js   # placeholderName: 'BaseTemplate', templateDir: './template'
├── template/            # Everything that is copied into a new app
├── docs/                # This documentation (not published to npm)
├── jest.config.js       # Tests for the template package itself
└── README.md            # npm / GitHub landing page
```

`package.json` publishes only `template/*` and `template.config.js` (see `"files"`).

## How `init` uses it

1. The CLI downloads the package and reads `template.config.js`.
2. It copies `template/` into the new project folder.
3. It replaces every `BaseTemplate` (file contents, file names, native project names) with the new app name.
4. It renames `_gitignore` to `.gitignore` (npm strips real `.gitignore` files from packages).
5. It runs `npm install` and, on macOS, `pod install`.

So anything that must reach the app has to live in `template/`, and names that should follow the app name must use the literal string `BaseTemplate`.

## Testing a change locally

From a folder outside the repo:

```bash
npx @react-native-community/cli init TestApp --template file:///Users/you/WorkSpace/base-template
```

Then run the app on both platforms and run `npm test` and `npm run lint` inside `TestApp`.

## Releasing

1. Update dependencies in `template/package.json` together: `react-native`, `@react-native/*` and `@react-native-community/cli*` versions must match the RN release. Use the [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) for native file changes in `template/android` and `template/ios`.
2. Update the docs for anything that changed.
3. Bump the version:

   ```bash
   npm version patch
   ```

4. Publish:

   ```bash
   npm publish
   ```

5. Push the commit and tag:

   ```bash
   git push --follow-tags
   ```
