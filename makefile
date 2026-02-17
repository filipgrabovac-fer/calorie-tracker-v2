# Local
local-up:
	docker compose -f docker/local/docker-compose.local.yml --project-directory . up

local-down:
	docker compose -f docker/local/docker-compose.local.yml --project-directory . down

local-build:
	docker compose -f docker/local/docker-compose.local.yml --project-directory . build --no-cache

local-rebuild:
	docker compose -f docker/local/docker-compose.local.yml --project-directory . down
	docker compose -f docker/local/docker-compose.local.yml --project-directory . build

# Production
prod-up:
	docker compose -f docker/prod/docker-compose.prod.yml --project-directory . up

prod-down:
	docker compose -f docker/prod/docker-compose.prod.yml --project-directory . down

prod-build:
	docker compose -f docker/prod/docker-compose.prod.yml --project-directory . build --no-cache

prod-rebuild:	
	docker compose -f docker/prod/docker-compose.prod.yml --project-directory . down
	docker compose -f docker/prod/docker-compose.prod.yml --project-directory . build

schema:
	rm -rf ./app/schema/schema.d.ts
	pnpm dlx openapi-typescript http://0.0.0.0:8000/api/schema/ -o ./app/schema/schema.d.ts