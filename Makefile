
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

test: node_modules
	@./node_modules/.bin/karma start test/karma.conf.js

node_modules: package.json
	@npm install --dev

.PHONY: clean test
