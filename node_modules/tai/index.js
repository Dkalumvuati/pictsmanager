#!/usr/bin/env node

const program = require('commander');
const fs = require('fs-extra');
const Preferences = require('preferences');

const close = require('./lib/close-out');
const openGithub = require('./lib/open-github');
const addBranches = require('./lib/add-branches');
const {alert, alertErr} = require('./lib/cli-tools');
const path = require('path');

let app = 'tai-v3';

// testing will not zero out app preferences.
const appName = path.parse(process.argv[1]).name;
if (appName === 'tai-test') app = 'tai-test';

const prefs = new Preferences(app);



program
  .command( 'config' )
  .option( '-g --githubToken <githubToken>')
  .option( '-o --githubOrg <githubOrg>')
  .option( '-s --sshEnable <boolean>')
  .description( 'Configure the application.' )
  .action(options => {
    const { githubOrg, githubToken, sshEnable } = options;
    if (githubOrg) {
      prefs.githubOrg = githubOrg;
      alert( 'Github organization configured.' );
    }
    if (githubToken) {
      prefs.githubToken = githubToken;
      alert( 'Github token configured.' );
    }
    if (sshEnable) {
      if (sshEnable === 'false') prefs.sshEnabled = false;
      else prefs.sshEnabled = true;
      alert( `SSH Github access is ${prefs.sshEnabled ? 'en':'dis'}abled.` );    }
  });

program
  .command('show-config')
  .option('-s --showKeys')
  .description('Display current configuration data.')
  .action((cmd) => {
    if (cmd.showKeys && prefs.githubToken) alert(`Current Github token is ${prefs.githubToken}`);
    if (prefs.sshEnabled) alert(`SSH Github access is ${prefs.sshEnabled ? 'en':'dis'}abled`);
    if (prefs.githubOrg) alert(`Current selected organization is ${prefs.githubOrg}`);
    else return alert( 'There is no current Github organization selected.' );
  });

program
  .command('clear')
  .description('Clear current Github data.')
  .option( '-g --githubToken')
  .option( '-o --githubOrg')
  .action((options) => {
    const { githubOrg, githubToken } = options;
    if (githubOrg) {
      prefs.githubOrg = undefined;
      alertErr( 'github organization cleared.' );
    }
    if (githubToken) {
      prefs.githubToken = undefined;
      alertErr( 'github token cleared.' );
    }
    if ( !githubOrg && !githubToken ) {
      prefs.githubOrg = undefined;
      prefs.githubToken = undefined;
      alertErr( 'Github configurations have been removed.' );
    }
  });

program
  .command('setup-branches <repoName> [branches]')
  .description('Create branches for the specified team')
  .action((repoName, branches) => {
    if (!prefs.githubOrg) return alertErr('No configuration found.  run config');
    prefs.branches = branches ? branches : prefs.students;
    addBranches( repoName, prefs )
      .then(() => alert( `Branches created for ${repoName}` ))
      .catch( (err) => {
        alertErr('Error setting up repo.');
        alertErr(err);
      });
  });
    
program
  .command('close <repoName>')
  .description('merge student branches into master folders')
  .action((repoName) => {
    if (!prefs.githubOrg) return alertErr('No configuration found.  run config');
    close(repoName, prefs)
      .then( () => alert(`repo "${repoName}" closed out`))
      .catch(err => {
        alertErr('error closing repo');
        alertErr(err);
      });
  });

program
  .command('team [filepath]')
  .description('set teams to specified json filepath')
  .action((filepath) => {
    if (!filepath && !prefs.students) return alertErr('No team is setup.');
    if (!filepath && prefs.students) {
      alert('Teams currently set to: ');
      return console.log(prefs.students);
    }
    const data = fs.readFileSync(filepath, {encoding: 'utf-8'});
    if (data) {
      alert('setting student teams to \n' + data);
      prefs.students = data;
    } else {
      alertErr('error setting teams');
    }
  });

program
  .command('open <repo_name>')
  .description('open repo on github')
  .action(repoName => openGithub(repoName, prefs));

program.parse(process.argv);
