.PHONY: help lint test build clean

help:
	@echo "Usage: make <command>"
	@echo "Available commands:"
	@echo "  help     Shows this help message"
	@echo "  install  Installs dependencies"
	@echo "  lint     Runs eslint"
	@echo "  test     Runs tests"
	@echo "  build    Builds the project"
	@echo "  publich  Publishes the package to npm"
	@echo "  clean    Removes node_modules and dist directories"

install:
	npm install

lint:
	npx eslint .

test:
	npm test

build:
	npm run build

publish: build
	npm publish --access public

clean:
	rm -rf node_modules dist
