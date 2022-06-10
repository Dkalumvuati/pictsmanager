PHONY: up-dev down-dev run-fixtures

up-dev:
	docker-compose -f docker-compose.yml up --build

mocha-test:
	(cd ./api && npm run mocha)

run-fixtures: # run all fixtures
	#(cd  ./api && docker exec -it npm run fixtures)

down-dev:
	docker-compose -f docker-compose.yml down

clean:
	@echo "Cleaning..."
	sh ./docker/remove-all-docker.sh
	@echo "Cleaning...done"