var assert = Java.type('org.junit.Assert');

var contentsResult = execute('content.findByParent', {
    parentPath: '123',
    from: 0,
    size: 10
});
var contents = Java.from(contentsResult.getSet());

assert.assertNotNull(contents);
assert.assertEquals('My Content', contents[0].displayName);