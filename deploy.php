<?php
/**
 * w-vision
 *
 * LICENSE
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that is distributed with this source code.
 *
 * @copyright  Copyright (c) 2017 Woche-Pass AG (https://www.w-vision.ch)
 */

namespace Deployer;

use Symfony\Component\Console\Input\InputOption;

require 'recipe/symfony3.php';  //Comes form deployer.phar

// Project Configuration
set('repository', 'git@github.com:manuel-kleinert/sandbox.ch.git');

// Configuration
//set('ssh_type', 'ext-ssh2');

set('default_stage', 'dev');
set('shared_files', [
    'app/config/parameters.yml',
    'var/config/system.php',
    'var/config/debug-mode.php',
    'var/config/maintenance.php'
]);
set('shared_dirs', []);

serverList(__DIR__ . '/deployer/servers.yml');

set('current_path', function () {
    $link = run('readlink {{deploy_path}}/httpdocs')->toString();
    return substr($link, 0, 1) === '/' ? $link : get('deploy_path') . '/' . $link;
});

task('deploy:create-release-symlink', function() {
    run('{{bin/symlink}} {{deploy_path}}/releases/{{release_name}}/web {{deploy_path}}/httpdocs');
});

set('bin/npm', function () {
    if (commandExist('npm')) {
        return run('which npm')->toString();
    }

    return false;
});

set('bin/php', function () {
    return '/opt/plesk/php/7.0/bin/php';
});

set('bin/install', function () {
    return sprintf('{{release_path}}/%s/install', trim(get('bin_dir'), '/'));
});

set('bin/mysql', function () {
    if (commandExist('mysql')) {
        return run('which mysql')->toString();
    }

    return false;
});

desc('Install npm packages');
task('npm:install', function () {
    if (has('previous_release')) {
        if (test('[ -d {{previous_release}}/node_modules ]')) {
            run('cp -R {{previous_release}}/node_modules {{release_path}}');
        }
    }
    run('cd {{release_path}} && {{bin/npm}} install');
});

task('npm:production', function() {
    run('cd {{release_path}} && {{env_vars}} {{bin/npm}} start production');
});

task('npm:develop', function() {
    run('cd {{release_path}} && {{env_vars}} {{bin/npm}} run dev');
});

task('wvision:known_hosts', function() {
    run('ssh-keyscan -H github.com >> ~/.ssh/known_hosts');
});

task('pimcore:install-classes', function() {
    run('{{bin/php}} {{release_path}}/bin/console deployment:classes-rebuild -c');
});

task('deploy:vendors-no-scripts', function () {
    run('cd {{release_path}} && {{env_vars}} {{bin/composer}} {{composer_options}} --no-scripts');
});

option('pimcore-mysql-username', null, InputOption::VALUE_OPTIONAL, 'Pimcore MySQL Username');
option('pimcore-mysql-password', null, InputOption::VALUE_OPTIONAL, 'Pimcore MySQL Password');
option('pimcore-mysql-database', null, InputOption::VALUE_OPTIONAL, 'Pimcore MySQL Database');
option('pimcore-admin-password', null, InputOption::VALUE_OPTIONAL, 'Pimcore Admin Password');
option('pimcore-admin-username', null, InputOption::VALUE_OPTIONAL, 'Pimcore Admin Username');
option('pimcore-install-profile', null, InputOption::VALUE_OPTIONAL, 'Pimcore Install Profile');

task('pimcore:install', function() {
    $pimcoreMysqlUsername = null;
    $pimcoreMysqlPassword = null;
    $pimcoreMysqlDatabase = null;

    if (input()->hasOption('pimcore-mysql-username') &&
        input()->hasOption('pimcore-mysql-password') &&
        input()->hasOption('pimcore-mysql-database') &&
        input()->hasOption('pimcore-admin-password') &&
        input()->hasOption('pimcore-admin-username') &&
        input()->hasOption('pimcore-install-profile')
    ) {
        $pimcoreMysqlUsername = input()->getOption('pimcore-mysql-username');
        $pimcoreMysqlPassword = input()->getOption('pimcore-mysql-password');
        $pimcoreMysqlDatabase = input()->getOption('pimcore-mysql-database');
        $pimcoreAdminUsername = input()->getOption('pimcore-admin-username');
        $pimcoreAdminPassword = input()->getOption('pimcore-admin-password');
        $profile = input()->getOption('pimcore-install-profile');

        $params = [
            '--profile ' . $profile,
            '--admin-username ' . $pimcoreAdminUsername,
            '--admin-password ' . $pimcoreAdminPassword,
            '--mysql-username ' . $pimcoreMysqlUsername,
            '--mysql-password ' . $pimcoreMysqlPassword,
            '--mysql-database ' . $pimcoreMysqlDatabase,
            '--ignore-existing-config',
            '--no-interaction'
        ];

        //ALTER DATABASE databasename CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

        run(sprintf('{{bin/mysql}} -u%s -p%s -e \'ALTER DATABASE `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\' %s', $pimcoreMysqlUsername, $pimcoreMysqlPassword, $pimcoreMysqlDatabase, $pimcoreMysqlDatabase));

        run('{{env_vars}} {{bin/php}} {{bin/install}} {{console_options}} ' . implode(' ', $params));

        return;
    }


    throw new \InvalidArgumentException('Arguments pimcore-mysql-username, pimcore-mysql-password, pimcore-mysql-database, pimcore-install-profile, pimcore-admin-username and pimcore-admin-password must be set!');
});

task('wvision:install:bundle', function() {
    run('{{env_vars}} {{bin/php}} {{bin/console}} {{console_options}} pimcore:bundle:enable WvisionBundle');
    run('{{env_vars}} {{bin/php}} {{bin/console}} {{console_options}} cache:clear --no-warmup');
    run('{{env_vars}} {{bin/php}} {{bin/console}} {{console_options}} pimcore:bundle:install WvisionBundle');
});

desc('Deploy your project');
task('deploy', [
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'wvision:known_hosts',
    'deploy:update_code',
    'deploy:shared',
    'deploy:writable',
    'deploy:vendors',
    'deploy:assets:install',
    'npm:install',
    'npm:production',
    'deploy:clear_paths',
    'pimcore:install-classes',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'success'
])->desc('Deploy your project');

task('deploy:setup', [
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'wvision:known_hosts',
    'deploy:update_code',
    'deploy:shared',
    'deploy:writable',
    'deploy:vendors-no-scripts',
    'deploy:clear_paths',
    'deploy:symlink',
    'pimcore:install',
    'wvision:install:bundle',
    'npm:install',
    'npm:develop',
    'deploy:assets:install',
    'deploy:create-release-symlink',
    'deploy:unlock',
    'cleanup',
    'success'
])->desc('Initial Setup of Pimcore Project');

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');
