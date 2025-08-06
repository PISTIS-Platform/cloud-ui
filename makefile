build:
	pnpm build
	docker buildx build --platform linux/amd64 . -t registry.pistis-market.eu/pistis/cloud-ui:${v}
