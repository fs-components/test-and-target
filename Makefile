
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

test: node_modules
	@./node_modules/.bin/karma start test/karma.conf.js

node_modules: package.json
	@npm install

test-web: build
	open /Applications/Google\ Chrome.app test/index.html

.PHONY: clean test
