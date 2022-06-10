const assert = require('chai').assert;
const execSync = require('child_process').execSync;
const exec = cmd => execSync(cmd, { encoding: 'utf-8' });
const read = require('fs').readFileSync;

describe('tai', () => {

  it('config', () => {
    assert.equal(exec('./tai-test clear'), '[X] Github configurations have been removed.\n');
    assert.equal(exec('./tai-test config -g 1234567890ABC'), '[*] Github token configured.\n');
    assert.equal(exec('./tai-test config -o test-org'), '[*] Github organization configured.\n');
    assert.equal(exec('./tai-test config -s true'), '[*] SSH Github access is enabled.\n');
    assert.equal(exec('./tai-test show-config'), '[*] SSH Github access is enabled\n[*] Current selected organization is test-org\n');
    assert.equal(exec('./tai-test show-config -s'), `[*] Current Github token is 1234567890ABC\n[*] SSH Github access is enabled\n[*] Current selected organization is test-org\n`);
  });

  it('team', () => {
    const set = exec('./tai-test team ./test/students.json');
    const branches = exec('./tai-test team');
    const expected = read('./test/students.json');
    assert.include( branches, expected );
  });
});