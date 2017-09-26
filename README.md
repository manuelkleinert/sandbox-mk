![demo.ch](http://placehold.it/888x240/0d64aa/ffffff?text=demo.ch "demo.ch")

# demo.ch

This git repository contains all changes made to this project, which can be viewed [here](https://www.demo.ch/).

### Installing

Clone this repo to your local machine and create a new vhost for it.

Then make sure you enable and install the extension `Wvision` inside Pimcore's extension manager.
When done with that, run the following cli commands inside your project's document root.

Install all dependencies

```
npm install
```

Start dev environment

```
npm start
```

## Deployment

Run the following cli command in order to deploy this on a live system

Setup on web server
```
deployer deploy:setup
```

Deploy to web server
```
deployer deploy
```

## Built With

* [Webpack](https://webpack.js.org/) - Bundles your assets
* [Gulp](http://gulpjs.com/) - Automates and enhances your workflow
* [Symfony](https://symfony.com/) - High performance PHP framework for web development
* [Zend Framework](https://framework.zend.com/) - Focused on simplicity, re-usability, and performance
* [Pimcore](https://www.pimcore.org/) - The open source enterprise content platform
* [CoreShop](http://www.coreshop.org/) - The open source eCommerce framework/system for Pimcore
* [UIkit](https://getuikit.com/) - A lightweight and modular front-end framework for developing fast and powerful web interfaces
* [Foundation for Emails](http://foundation.zurb.com/emails.html) - Quickly create responsive HTML emails that work

## License

© 2017 w-vision, All rights reserved. Sandgruebestrasse 4 | 6210 Sursee, Switzerland