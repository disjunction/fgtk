var flame = require('flame');

describe ('Webpage', function() {
    it('parses location', function() {
        var window = {
                location: {
                    href: 'http://some.site.com/der/path',
                    search: '?a=1234&truth=freedom'
                }
            },
            page = new flame.view.Webpage({window: window});
            
        expect(page.host).toBe('some.site.com');

        expect(page.params.a).toBe('1234');
        expect(page.params.truth).toBe('freedom');
    });
});
