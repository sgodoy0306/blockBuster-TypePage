# Variables
BACKEND_DIR=backend

.PHONY: install start dev build lint test

install:
	cd $(BACKEND_DIR) && npm install

start-db:
	docker compose up -d

start-api:
	cd $(BACKEND_DIR) && npm run dev

start-backend:
	docker compose up -d && cd $(BACKEND_DIR) && npm run dev

lint:
	cd $(BACKEND_DIR) && npm run lint

test:
	cd $(BACKEND_DIR) && npm test
