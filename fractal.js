'use strict';

const path = require('path');
const mandelbrot = require('@frctl/mandelbrot');

/*
 * Require the Fractal module
 */
const fractal = module.exports = require('@frctl/fractal').create();

/*
 * Give your project a title.
 */
fractal.set('project.title', 'Pattern Library');

/*
 * Tell Fractal where to look for components.
 */
fractal.components.set('path', path.join(__dirname, 'pattern-library-source'));
fractal.components.set('default.preview', '@preview');
fractal.components.set('default.status', 'wip');

/*
 * Tell Fractal where to look for documentation pages.
 */
fractal.docs.set('path', path.join(__dirname, 'docs'));
fractal.web.set('static.mount', 'assets');

/*
 * Tell the Fractal web preview plugin where to look for static assets.
 */
fractal.web.set('static.path', path.join(__dirname, 'dist/Content'));

/*
 * Tell the Fractal where to generate static HTMLs.
 */
fractal.web.set('builder.dest', path.join(__dirname, 'pattern-library'));

/*
 * Customizing Mandelbrot theme
 */
const customisedTheme = mandelbrot({
	skin: 'aqua',
	panels: ['html', 'resources', 'info', 'notes'],
	highlightStyles: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.5.0/styles/monokai.min.css',
	information: [
        {
            label: 'Version',
            value: '1.0.0',
        },
        {
            label: 'Built on',
            value: new Date(),
            type: 'time', // Outputs a <time /> HTML tag
            format: (value) => {
                return value.toLocaleDateString('en');
            }
        }
    ]
});

fractal.web.theme(customisedTheme);

fractal.components.set('default.context', {
	site: {
		title: 'Pattern Library',
		company: 'Horizontal Digital'
	}
});
