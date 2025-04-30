Groundschool LMS, a custom theme for Open edX
=============================================

Groundschool LMS is an elegant, customizable theme for `Open edX <https://openedx.org>`__.

.. image:: ./screenshots/01-landing-page.png
    :alt: Platform landing page

You can view the theme in action at https://sandbox.openedx.edly.io.

Installation
------------

This theme was specially developed to be used with `Tutor <https://docs.tutor.edly.io>`__ (at least v20.0.0, targeting Teak).

Install and enable the Groundschool LMS plugin::

    # Install from source (replace with pip install tutor-groundschool-lms if published)
    pip install -e .
    tutor plugins enable groundschoollms
    tutor config save
    # Use dev or local launch as per your workflow
    tutor dev launch # or tutor local launch

The Groundschool LMS theme will be automatically enabled if you have not previously defined a theme. To override an existing theme, use the `settheme command <https://docs.tutor.edly.io/local.html#setting-a-new-theme>`__::

    tutor local do settheme groundschool-lms # Use the theme directory name

Configuration
-------------

- ``GROUNDSCHOOL_LMS_WELCOME_MESSAGE`` (default: "The place for all your online learning")
- ``GROUNDSCHOOL_LMS_PRIMARY_COLOR`` (default: "#15376D")
- ``GROUNDSCHOOL_LMS_FOOTER_NAV_LINKS`` (default: ``[{"title": "About Us", "url": "/about"}, ...]``)
- ``GROUNDSCHOOL_LMS_ENABLE_DARK_TOGGLE`` (default: True)

The ``GROUNDSCHOOL_LMS_*`` settings listed above may be modified by running ``tutor config save --set GROUNDSCHOOL_LMS_...=...``. For instance, to remove all links from the footer, run::

    tutor config save --set "GROUNDSCHOOL_LMS_FOOTER_NAV_LINKS=[]"

Or, to set the primary color to forest green, run::

    # Note: The nested quotes are needed in order to handle the hash (#) correctly.
    tutor config save --set 'GROUNDSCHOOL_LMS_PRIMARY_COLOR="#225522"'

Theme Toggle Button
-------------------

The theme toggle button is enabled by default. To disable it, run::

    tutor config save --set GROUNDSCHOOL_LMS_ENABLE_DARK_TOGGLE=false
    tutor images build openedx # or openedx-dev
    tutor local start -d # or tutor dev start -d


Customization
-------------

This plugin can serve as a starting point to create your own themes. Just fork this repository and modify the files as you see fit.

You will have to start by installing the plugin from source::

    git clone <your-fork-url>
    cd <your-repo-name>
    pip install -e .
    tutor plugins enable groundschoollms # Or your plugin name

Any change you make to the theme can be viewed immediately in development mode (with `tutor dev ...` commands) after you run::

    tutor dev watch themes

If you modify Python code (`plugin.py`) or add new files/directories, you might need to regenerate the environment and restart::

    tutor dev stop
    tutor config save
    tutor dev launch
    tutor dev start -d

To deploy your changes to production, you will have to rebuild the "openedx" Docker image and restart your containers::

    tutor images build openedx
    tutor local start -d

Changing the Styling in Sass files
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To customize the theme stylesheets, modify the files in the ``tutorgroundschoollms/templates/groundschool-lms/lms/static/sass/`` and ``tutorgroundschoollms/templates/groundschool-lms/cms/static/sass/`` directories.


Changing the default logo and other images
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The theme images are stored in ``tutorgroundschoollms/templates/groundschool-lms/lms/static/images`` for the LMS, and in ``tutorgroundschoollms/templates/groundschool-lms/cms/static/images`` for the CMS. Replace files here.

Overriding the default "about", "contact", etc. static pages
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Override static templates by adding your own files in::

    tutorgroundschoollms/templates/groundschool-lms/lms/templates/static_templates/

For instance, edit the "donate.html" file in this directory.

Troubleshooting
---------------

Can't override styles using Groundschool LMS Theme for MFEs
----------------------------------------------------------

The theme primarily styles edx-platform. MFE styling relies on the `@edx/brand` package. Customize the brand package (e.g., `@edly-io/groundschool-lms-brand-openedx` referenced in `plugin.py`) and ensure it's installed in the MFE build process via the patches in `plugin.py`.

This Tutor plugin is maintained by Edly. Community support is available from the official `Open edX forum <https://discuss.openedx.org>`__. Do you need help with this plugin? See the `troubleshooting <https://docs.tutor.edly.io/troubleshooting.html>`__ section from the Tutor documentation.


License
-------

This work is licensed under the terms of the `GNU Affero General Public License (AGPL) <./LICENSE.txt>`_.
