install:
	npm ci
	
publish:
	npm publish --dry-run

lint:
	npx eslint .

link: 
	sudo npm link

test:
	NODE_OPTIONS=--experimental-vm-modules npx jest

watch:
	NODE_OPTIONS=--experimental-vm-modules npx jest --watch

coverage:         
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

nockdebug:
	DEBUG=nock.* NODE_OPTIONS=--experimental-vm-modules npx jest