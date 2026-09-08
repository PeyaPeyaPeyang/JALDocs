# Dependency security fixes

`package.json` overrides retain fixed versions of `serialize-javascript`, `qs`, and the `uuid` used by `sockjs`. Remove an override when its parent dependency accepts a fixed version without it.

## image-size 2.0.2

There is no published fixed version for [GHSA-w3rx-r6r6-pgpr](https://github.com/advisories/GHSA-w3rx-r6r6-pgpr) and [GHSA-5p2g-fcmc-qvqq](https://github.com/advisories/GHSA-5p2g-fcmc-qvqq).

The pnpm patch validates ICNS entry lengths and ISO box lengths before advancing offsets. A zero-length ISO box extends to the end of the input. Invalid sizes cannot keep the ICNS, HEIF, or JXL loops at the same offset. The patch covers both CommonJS and ESM bundles, including the file-reading entry points.

Run `pnpm run test:security` after dependency updates. Malformed inputs run in separate processes with a timeout; a normal PNG must still report its dimensions. CI runs the same checks before building.

Docusaurus uses this package to read image dimensions during compilation. This static site does not accept visitor uploads for server-side image processing. The version-based audit still reports these two advisories because it cannot inspect the patch; they are not ignored or dismissed. Replace the patch with an upstream fixed release when available.
