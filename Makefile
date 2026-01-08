.PHONY: help setup start stop clean logs restart

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Set up and start the entire application (first time)
	@echo "🚀 Setting up Furry Love application..."
	@echo "📦 Building and starting all services..."
	docker-compose up --build -d
	@echo ""
	@echo "✅ Application is ready!"
	@echo "🌐 Frontend: http://localhost:5173"
	@echo "🔧 Backend API: http://localhost:3001/api"
	@echo ""
	@echo "📝 Note: Database migrations and seeding will run automatically"
	@echo "⏳ Wait 10-15 seconds for all services to be ready"

start: ## Start all services
	@echo "▶️  Starting all services..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "🌐 Frontend: http://localhost:5173"
	@echo "🔧 Backend API: http://localhost:3001/api"

stop: ## Stop all services
	@echo "⏹️  Stopping all services..."
	docker-compose down
	@echo "✅ Services stopped!"

clean: ## Stop all services and remove volumes (⚠️  deletes database data)
	@echo "🧹 Cleaning up all containers, networks, and volumes..."
	docker-compose down -v
	@echo "✅ Cleanup complete!"

logs: ## Show logs from all services
	docker-compose logs -f

restart: ## Restart all services
	@echo "🔄 Restarting all services..."
	docker-compose restart
	@echo "✅ Services restarted!"
