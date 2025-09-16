# Web Password Generator - Development Makefile
# Simple development server and common tasks

.PHONY: serve dev start stop clean install test lint

# Default target
all: serve

# Start development server
serve: dev
dev:
	@echo "🚀 Starting development server..."
	@PORT=8000; \
	while [ $$PORT -le 8010 ]; do \
		if ! lsof -i :$$PORT >/dev/null 2>&1; then \
			echo "📝 Starting server on port $$PORT"; \
			echo "🌐 Open http://localhost:$$PORT in your browser"; \
			echo "⏹️  Press Ctrl+C to stop the server"; \
			python3 -m http.server $$PORT; \
			break; \
		else \
			echo "⚠️  Port $$PORT is busy, trying $$((PORT + 1))..."; \
			PORT=$$((PORT + 1)); \
		fi; \
	done; \
	if [ $$PORT -gt 8010 ]; then \
		echo "❌ No available ports found (8000-8010)"; \
		exit 1; \
	fi

# Alternative using Node.js if available
serve-node:
	@echo "🚀 Starting Node.js development server..."
	@command -v npx >/dev/null 2>&1 || { echo "❌ Node.js/npx not found. Use 'make serve' instead."; exit 1; }
	@PORT=8000; \
	while [ $$PORT -le 8010 ]; do \
		if ! lsof -i :$$PORT >/dev/null 2>&1; then \
			echo "📝 Starting Node.js server on port $$PORT"; \
			echo "🌐 Open http://localhost:$$PORT in your browser"; \
			npx http-server -p $$PORT -c-1; \
			break; \
		else \
			echo "⚠️  Port $$PORT is busy, trying $$((PORT + 1))..."; \
			PORT=$$((PORT + 1)); \
		fi; \
	done; \
	if [ $$PORT -gt 8010 ]; then \
		echo "❌ No available ports found (8000-8010)"; \
		exit 1; \
	fi

# Start server (alias for serve)
start: serve

# Stop any running servers on ports 8000-8010
stop:
	@echo "🛑 Stopping development servers..."
	@for port in $$(seq 8000 8010); do \
		pkill -f "python3 -m http.server $$port" 2>/dev/null || true; \
		pkill -f "http-server.*$$port" 2>/dev/null || true; \
	done
	@echo "✅ All development servers stopped"

# Open browser (finds running server port)
open:
	@echo "🌐 Opening browser..."
	@PORT=8000; \
	FOUND=0; \
	while [ $$PORT -le 8010 ]; do \
		if lsof -i :$$PORT >/dev/null 2>&1; then \
			echo "📝 Found server running on port $$PORT"; \
			FOUND=1; \
			break; \
		fi; \
		PORT=$$((PORT + 1)); \
	done; \
	if [ $$FOUND -eq 1 ]; then \
		command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:$$PORT || \
		command -v open >/dev/null 2>&1 && open http://localhost:$$PORT || \
		echo "❌ Cannot open browser automatically. Go to http://localhost:$$PORT"; \
	else \
		echo "❌ No development server found running. Start with 'make serve' first."; \
	fi

# Clean temporary files
clean:
	@echo "🧹 Cleaning temporary files..."
	@find . -name "*.tmp" -delete || true
	@find . -name "*.log" -delete || true
	@find . -name ".DS_Store" -delete || true
	@echo "✅ Cleanup completed"

# Install development dependencies (if needed)
install:
	@echo "📦 No dependencies to install for this static site"
	@echo "✅ Ready to develop"

# Basic HTML/CSS/JS validation
lint:
	@echo "🔍 Checking files..."
	@if command -v html5validator >/dev/null 2>&1; then \
		html5validator --root . --ignore-re ".*\.git.*"; \
	else \
		echo "⚠️  html5validator not installed. Skipping HTML validation."; \
	fi
	@echo "✅ Lint check completed"

# Test that files exist and server can start
test:
	@echo "🧪 Running basic tests..."
	@test -f index.html || { echo "❌ index.html not found"; exit 1; }
	@test -f style.css || { echo "❌ style.css not found"; exit 1; }
	@test -f script.js || { echo "❌ script.js not found"; exit 1; }
	@echo "✅ All required files exist"
	@echo "🧪 Testing server start with port detection..."
	@TEST_PORT=8020; \
	while [ $$TEST_PORT -le 8030 ]; do \
		if ! lsof -i :$$TEST_PORT >/dev/null 2>&1; then \
			echo "📝 Testing on port $$TEST_PORT"; \
			timeout 3s python3 -m http.server $$TEST_PORT >/dev/null 2>&1 & \
			SERVER_PID=$$!; \
			sleep 1; \
			if curl -s http://localhost:$$TEST_PORT >/dev/null 2>&1; then \
				echo "✅ Server test passed on port $$TEST_PORT"; \
				kill $$SERVER_PID 2>/dev/null || true; \
				break; \
			else \
				echo "❌ Server test failed on port $$TEST_PORT"; \
				kill $$SERVER_PID 2>/dev/null || true; \
				exit 1; \
			fi; \
		else \
			TEST_PORT=$$((TEST_PORT + 1)); \
		fi; \
	done

# Show help
help:
	@echo "📖 Available commands:"
	@echo ""
	@echo "  make serve    - Start development server (auto-detects available port 8000-8010)"
	@echo "  make dev      - Alias for serve"
	@echo "  make start    - Alias for serve"
	@echo "  make stop     - Stop all development servers (ports 8000-8010)"
	@echo "  make open     - Open browser to running server (auto-detects port)"
	@echo "  make clean    - Remove temporary files"
	@echo "  make test     - Run basic file and server tests"
	@echo "  make lint     - Validate HTML/CSS/JS (if tools available)"
	@echo "  make help     - Show this help message"
	@echo ""
	@echo "🚀 Quick start: make serve"