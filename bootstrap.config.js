module.exports = {

  // Default for the style loading
  styleLoader: 'style-loader!css-loader!less-loader',

  scripts: {
    // 'button': true,
    'tab': false,
    'dropdown': false,
    'modal': false,
  },
  styles: {
    mixins: true,

    normalize: true,
    print: true,
    buttons: true,
    'button-groups': true,
    tables: true,

    scaffolding: true,
    grid: true,
    forms: true,
    navs: true,

    navbar: true,
    'buttons': true,
    close: true,
    modals: true,
    dropdowns: true,

    utilities: true,
    "responsive-utilities": true
  }
};
