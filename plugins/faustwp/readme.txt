=== Faust ===
Contributors: antpb, apmatthe, blakewpe, chriswiegman, claygriffiths, jasonkonen, joefusco, markkelnar, matthewguywright, mindctrl, modernnerd, rfmeier, TeresaGobble, thdespou, wpengine
Tags: faustjs, faust, headless, decoupled
Requires at least: 5.7
Tested up to: 6.1
Stable tag: 0.8.0
Requires PHP: 7.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Faust transforms your traditional WordPress installation into a flexible headless CMS.

== Description ==

In conjunction with the [Faust NPM packages](https://www.npmjs.com/search?q=%40faustwp), Faust enables a decoupled front-end to authenticate with WordPress through GraphQL mutations and REST API endpoints. It is the bridge between a Faust-powered front-end application, and a WordPress backend.

The plugin also provides useful options for headless sites, such as the ability to:

- Hide “theme” admin pages.
- Redirect public route requests to the front-end application.
- Rewrite WordPress URLs to front-end URLs in queried content.

== Installation ==

1. Search for the plugin in WordPress under "Plugins -> Add New".
2. Click the “Install Now” button, followed by "Activate".

That's it! For more information on getting started with headless WordPress, see [Getting Started with Faust](https://faustjs.org/docs/tutorial/dev-env-setup).

== Changelog ==WP

= 0.8.0 =

### Minor Changes

- b59d6c0: Renamed plugin from `FaustWP` to `Faust`.
- b59d6c0: Updated settings menu text from _Headless_ to _Faust_.

= 0.7.11 =

### Patch Changes

- b3c70a4: Prevent WordPress RSS feeds from redirecting to the front-end application.

= 0.7.10 =

### Patch Changes

- 88ce018: Fix generate endpoint when WordPress is installed within a subdirectory. Props to @kermage for the fix!
- 0c757a2: Remove unnecessary config from wordpress.org zip.

[View the full changelog](https://faustjs.org/docs/changelog/faustwp)