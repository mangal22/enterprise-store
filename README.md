# Enterprise Store

An enterprise-style e-commerce learning project composed of independently runnable Spring Boot microservices and an Angular frontend. It is designed as a senior-level architecture and technical interview scaffold.

## Technology Stack

- Java 21
- Spring Boot 4.1.x / Spring Framework 7
- Maven multi-module backend
- Spring WebFlux and Project Reactor
- Reactive Spring Data MongoDB
- MongoDB
- Resilience4j circuit breaker
- Angular 22 standalone components
- Angular Signals and zoneless change detection
- TypeScript 6

## Repository Structure

```text
enterprise-store/
├── backend/
│   ├── pom.xml
│   ├── run-backend.ps1
│   ├── api-gateway/
│   │   └── src/main/java/com/example/store/gateway/
│   │       ├── config/
│   │       └── security/
│   ├── product-service/
│   │   └── src/main/java/com/example/store/product/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── domain/
│   │       ├── dto/
│   │       ├── repository/
│   │       └── service/impl/
│   ├── order-service/
│   │   └── src/main/java/com/example/store/order/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── domain/
│   │       ├── dto/
│   │       ├── repository/
│   │       └── service/impl/
│   └── account-service/
│       └── src/main/java/com/example/store/account/
│           ├── config/
│           ├── controller/
│           ├── domain/
│           ├── dto/
│           ├── repository/
│           └── service/impl/
└── frontend/
		├── package.json
		└── src/app/
				├── core/
				├── shared/
				└── features/cart/
						├── components/
						├── models/
						└── services/
```

The backend parent POM is an aggregator. It compiles all modules, but each service has its own application class, port, configuration, and JVM process.

## Prerequisites

Install and verify:

```powershell
java -version       # Java 21
mvn -version        # Maven
node --version      # Node.js compatible with Angular 22
npm --version
```

Start MongoDB locally. The services use:

```text
mongodb://localhost:27017/enterprise_store_db
```

For a local Docker installation, an example MongoDB command is:

```powershell
docker run --name enterprise-store-mongo -p 27017:27017 -d mongo
```

## Run the Backend

### Production-like Docker Compose

Copy `.env.example` to `.env`, replace `JWT_SECRET` with a randomly generated secret, and start the stack:

```powershell
Copy-Item .env.example .env
docker compose up --build -d
docker compose ps
```

The Compose stack starts MongoDB, all four backend services, and the Nginx-served frontend. Stop it with:

```powershell
docker compose down
```

Add `-v` only when you intentionally want to delete the MongoDB volume and all local data.

### Start all services with one command

From `enterprise-store/backend`:

```powershell
.\run-backend.ps1
```

The script opens one PowerShell window per service so each independent JVM has separate logs:

| Service | Port | Responsibility |
|---|---:|---|
| API Gateway | 8090 | Edge security and JWT claim extraction |
| Product Service | 8091 | Product CRUD and MongoDB persistence |
| Order Service | 8092 | Checkout workflow and order persistence |
| Account Service | 8093 | Registration, login, BCrypt passwords, and JWT issuance |

If PowerShell blocks local scripts, run this once for the current user, then retry:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Start a single service

Open a terminal in the selected module:

```powershell
cd .\backend\product-service
mvn spring-boot:run
```

Replace `product-service` with `order-service`, `account-service`, or `api-gateway` as needed.

### Compile all backend modules

```powershell
cd .\backend
mvn compile
```

`mvn run` is not a valid Maven goal. Use `mvn spring-boot:run` inside a service module.

## Run the Frontend

From `enterprise-store/frontend`:

```powershell
npm install
npm start
```

Open `http://localhost:4200` in a browser. To verify a production build without starting a server:

```powershell
npm run build
```

The Angular app uses standalone components, lazy route loading, Signals, and zoneless change detection. No `NgModule` is required.

## API Endpoints

The current scaffold exposes these service-level endpoints:

### Product Service, port 8091

```http
GET  /api/products
GET  /api/products/{id}
POST /api/products
```

Example request:

```json
{
	"name": "Mechanical Keyboard",
	"description": "Low-profile wireless keyboard",
	"price": 89.99,
	"stock": 25
}
```

### Order Service, port 8092

```http
POST /api/orders/checkout
```

Example request:

```json
{
	"customerId": "customer-001",
	"total": 89.99
}
```

The checkout endpoint is protected with a Resilience4j `@CircuitBreaker` and publishes an order-created event through the `MessageProducer` abstraction. The current implementation uses a logging producer as a replaceable local stand-in for Kafka, RabbitMQ, or another broker.

### Account Service, port 8093

```http
POST /api/auth/register
POST /api/auth/login
```

Registration requires a name, email, and password of at least eight characters. Passwords are stored as BCrypt hashes, never as plaintext. Successful registration or login returns a signed JWT used by the frontend interceptor.

### Order history

```http
GET /api/orders/history/{customerId}
```

Registered checkout stores the account user ID as `customerId`, allowing the order-history page to load that user’s orders. Guest checkout generates a random `guest-<UUID>` customer ID on the server.

### API Gateway, port 8090

The gateway contains the WebFlux security filter chain and manually parses the JWT payload from a Bearer token. It currently demonstrates the security boundary; route proxying and token signature verification should be added before treating it as production-ready.

## Architecture Concepts Covered

### Backend

- Microservice boundaries and independent deployment
- Maven multi-module organization
- Layered architecture: controller, service, repository, domain, DTO, and configuration
- Reactive REST APIs with WebFlux and Reactor `Mono`/`Flux`
- Reactive MongoDB repositories
- Java 21 records for immutable request and response DTOs
- MongoDB `@Document` mapping and optimistic locking with `@Version`
- Dependency inversion through service and message-producer interfaces
- Circuit breakers and fallback behavior with Resilience4j
- JWT bearer-header parsing and reactive Spring Security context propagation
- Micrometer observation registry and actuator-oriented observability structure
- Virtual-thread configuration through `spring.threads.virtual.enabled=true`

### Frontend

- Standalone Angular application bootstrapping
- Lazy-loaded feature routes
- Feature-based folder organization
- Functional `HttpInterceptorFn`
- Signal-based state with `WritableSignal`, readonly signals, and `computed`
- Angular `@if` and `@for` control flow
- OnPush-compatible component design
- Independent frontend/backend development and deployment
- Externalized environment configuration through Spring placeholders and `.env`
- Containerized Java 21 services running as a non-root user
- MongoDB persistent volume and service health-gated startup
- Kubernetes-friendly liveness/readiness probes through Actuator
- Nginx SPA fallback for deep Angular links
- Restart policies, resource-aware JVM options, and production image separation

## Interview Questions You Can Practice

- Why should a product service own its product data instead of sharing tables?
- When is a reactive stack useful, and when is traditional Spring MVC simpler?
- How does optimistic locking prevent lost product-stock updates?
- What should happen when a dependency is unavailable during checkout?
- Why should a circuit breaker live at a dependency boundary?
- How would you replace the logging producer with Kafka while preserving the service contract?
- Where should JWT signature validation occur, and why is payload decoding alone insufficient?
- How would you add idempotency to checkout requests?
- How would you model an outbox or saga for reliable order events?
- How would you introduce API versioning, correlation IDs, tracing, and centralized configuration?
- When would you choose Signals, RxJS, or a global state library in Angular?
- How would you deploy and scale each service independently?

## Current Scope and Production Follow-ups

This repository is a runnable architectural scaffold, not a complete commerce platform. Before a public production deployment, add a managed secret store, TLS termination, a real API gateway route/proxy policy, centralized error responses, request validation, rate limiting, refresh-token rotation, a real message broker, automated integration/security tests, OpenTelemetry exporters, CI/CD image scanning, and Kubernetes manifests or a managed container platform deployment.
