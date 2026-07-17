# 



# Technical Design Document: Vacation Rental Marketplace Platform
## Document Information
| Field | Value |
| ----- | ----- |
| **Project Name** | Vacation Rental Marketplace |
| **Document Version** | 1.0 |
| **Last Updated** | 2024 |
| **Status** | Draft |
| **Authors** | Platform Architecture Team |
---

## 1. Overview
### 1.1 Executive Summary
This document describes the technical design for a production-scale vacation rental marketplace platform. The system enables guests to discover and book vacation properties while providing hosts with tools to manage listings, availability, and payouts. The architecture is designed to scale from initial launch through 100× growth while maintaining sub-200ms search latency and five-nines availability for the booking critical path.

### 1.2 Background
The vacation rental market requires a platform that can handle:

- High-read, low-write traffic patterns (search:booking ratio ~1000:1)
- Geographically distributed users with latency sensitivity
- Complex search queries combining location, dates, amenities, and pricing
- Financial transactions requiring PCI-DSS compliance
- Real-time availability management to prevent double-bookings
- Media-heavy content (property photos are the primary conversion driver)
### 1.3 Document Scope
This TDD covers:

- System architecture across all layers (edge through data)
- Core domain services and their interactions
- Data storage strategy and consistency model
- Search and ranking infrastructure
- Deployment and operational concerns
- Security and compliance requirements
The architecture diagram provides a C4-style layered view showing synchronous (solid lines) and asynchronous (dashed lines) communication patterns across nine architectural layers.

---

## 2. Goals and Non-Goals
### 2.1 Goals
| Goal | Success Metric |
| ----- | ----- |
| **Search Performance** | p95 latency < 200ms for geo-filtered search queries |
| **Booking Reliability** | 99.99% success rate for confirmed bookings |
| **Global Availability** | 99.9% uptime across all regions |
| **Scalability** | Support 100× traffic growth without architectural redesign |
| **Developer Velocity** | Independent service deployments with < 15 min lead time |
| **Compliance** | PCI-DSS Level 1, GDPR, regional data residency |
### 2.2 Non-Goals
- **Real-time pricing optimization** — Dynamic pricing will use batch-computed models, not real-time ML inference
- **Native mobile applications** — Initial release targets responsive web; native apps are Phase 2
- **Instant messaging with typing indicators** — Messaging is near-real-time (< 5s), not instant
- **Host-side analytics dashboards** — Basic metrics only; advanced analytics deferred to BI tools
- **Multi-currency settlement** — Hosts receive payouts in their configured currency only
---

## 3. Architecture
### 3.1 Architectural Principles
1. **Database-per-service** — Each domain service owns its data; no shared databases
2. **Event-driven integration** — Services communicate via Kafka events for loose coupling
3. **Polyglot persistence** — Right tool for each data pattern (OLTP, search, time-series, blob)
4. **Defense in depth** — Security at every layer (edge, gateway, mesh, service, data)
5. **Observable by default** — Distributed tracing, metrics, and logs from day one
### 3.2 Layer Overview
The architecture diagram illustrates nine distinct layers, each with specific responsibilities:

| Layer | Purpose | Key Components |
| ----- | ----- | ----- |
| **1. Edge/Client** | Content delivery, rendering, performance | Global CDN (Cloudflare/Fastly), Next.js (SSR/ISR/CSR), Image CDN, Feature Flags |
| **2. API/Gateway** | Security, routing, aggregation | WAF, API Gateway (Kong/Envoy), GraphQL Federation BFFs |
| **3. Core Domain** | Business logic, domain ownership | 14 microservices on Kubernetes with Istio mesh |
| **4. Data** | Persistence, caching, analytics | Postgres, Redis, Elasticsearch, Cassandra, S3, Snowflake |
| **5. Search & Ranking** | Discovery, personalization | Query Parser, Geo Search, Base Relevance, ML Re-Ranker |
| **6. Async/Event** | Decoupling, sagas, CDC | Kafka, Outbox Pattern, Booking SAGA orchestrator |
| **7. Deployment** | Infrastructure, delivery | EKS/GKE, Istio, Terraform, ArgoCD, GitHub Actions |
| **8. Observability** | Monitoring, alerting, tracing | Prometheus, Grafana, OpenTelemetry, Jaeger, Loki |
| **9. Security** | Compliance, secrets, encryption | PCI-DSS isolation, Vault/KMS, mTLS |
### 3.3 Core Domain Services
The architecture diagram shows 14 core domain services, each with single responsibility:

| Service | Responsibility | Database | Scaling Characteristics |
| ----- | ----- | ----- | ----- |
| **Identity** | OAuth2/OIDC authentication, session management | Postgres + Redis | Read-heavy, cacheable |
| **Listings** | Property CRUD, amenities, house rules | Postgres (sharded) | Write-moderate, read-heavy |
| **Search & Discovery** | Query orchestration, filter application | Elasticsearch (read) | Extreme read, latency-critical |
| **Availability** | Date locks, calendar management | Cassandra | High-write during booking spikes |
| **Pricing** | Dynamic pricing, FX conversion | Postgres + Redis | Read-heavy, batch-updated |
| **Booking** | Reservation lifecycle, SAGA orchestration | Postgres | Write-heavy during spikes, transactional |
| **Payments** | Tokenization, charges, refunds (PCI-scoped) | Isolated Postgres | Low-volume, high-security |
| **Messaging** | Guest↔Host communication | Cassandra | High-write, append-only |
| **Reviews** | Ratings, review content, moderation | Postgres | Write-after-stay, read-heavy |
| **Trust & Safety** | Fraud scoring, risk assessment | Postgres + ML models | Event-driven, async |
| **Notifications** | Email, SMS, push delivery | Stateless + queues | Burst-capable, async |
| **Media** | Upload, virus scan, transformation | S3 + processing queue | I/O bound, async |
| **Host Tools** | iCal sync, payout management, dashboard | Postgres | Low-traffic, host-only |
| **Re-Ranker** | ML personalization, embedding lookup | Feature store + Redis | Latency-critical, GPU optional |
### 3.4 Request Flows
#### Search Flow
```
Users → CDN → Next.js → WAF → API Gateway → Web BFF → Search Service
                                                          ↓
                                              Query Parser → Geo Search → Base Relevance → Re-Ranker
                                                                                              ↓
                                                                                        Elasticsearch
```
#### Booking Flow (SAGA Pattern)
```
Web BFF → Booking Service → [SAGA Orchestrator via Kafka]
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
              Availability     Payments      Notifications
              (hold dates)   (auth charge)   (confirmation)
                    
On failure: Compensating transactions roll back in reverse order
```
#### Media Flow
```
Next.js → Media Service → S3 (upload)
                            ↓
                      [Processing Queue]
                            ↓
                    Virus Scan → Resize → AVIF/WebP conversion
                            ↓
                      Image CDN (pull from S3)
```
---

## 4. Data Model
### 4.1 Storage Strategy
The architecture diagram shows a polyglot persistence approach with clear ownership:

| Store | Use Case | Why This Choice |
| ----- | ----- | ----- |
| **Postgres (sharded by geo)** | Bookings, listings, payments, users | ACID for money; sharding enables horizontal scale |
| **Redis Cluster** | Sessions, hot listings cache, rate limiting | Sub-ms reads for hot path |
| **Elasticsearch** | Search read model with denormalized docs | Geo queries, full-text, facets at scale |
| **Cassandra/DynamoDB** | Chat messages, availability events, activity | High-write throughput, tunable consistency |
| **S3** | Photos, documents, media assets | Infinite scale, CDN-friendly |
| **Snowflake/BigQuery** | BI dashboards, ML training data | Analytical workloads separated from OLTP |
### 4.2 Data Consistency Model
| Data Type | Consistency | Rationale |
| ----- | ----- | ----- |
| Booking state | Strong (Postgres) | Money and inventory require ACID |
| Search index | Eventual (CDC lag ~seconds) | Acceptable for discovery; booking re-validates |
| Availability cache | Eventual (short TTL) | Busted on price/availability change events |
| Chat messages | Eventual (Cassandra) | Ordering within partition is sufficient |
| Analytics | Eventual (batch ETL) | Historical analysis tolerates lag |
### 4.3 Key Entities
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────<│  Listing    │>────│  Booking    │
│             │     │             │     │             │
│ id          │     │ id          │     │ id          │
│ email       │     │ host_id     │     │ listing_id  │
│ role        │     │ geo_shard   │     │ guest_id    │
│ created_at  │     │ amenities[] │     │ check_in    │
└─────────────┘     │ pricing     │     │ check_out   │
                    │ status      │     │ status      │
                    └─────────────┘     │ total_price │
                           │            └─────────────┘
                           │
                    ┌──────┴──────┐
                    │ Availability │
                    │              │
                    │ listing_id   │
                    │ date         │
                    │ status       │
                    │ price        │
                    └──────────────┘
```
### 4.4 Change Data Capture (CDC)
As shown in the architecture diagram, Debezium captures Postgres changes and streams to Kafka:

- **PG → Kafka → Elasticsearch**: Listing updates propagate to search index
- **PG → Kafka → Snowflake**: Transactional data flows to analytics warehouse
- **Outbox Pattern**: Services write events to local outbox table; Debezium publishes to Kafka (no dual-write risk)
---

## 5. API Design
### 5.1 API Gateway Layer
The architecture diagram shows Kong/Envoy as the API Gateway providing:

- **Authentication/Authorization**: JWT validation, OAuth2 token introspection
- **Rate Limiting**: Per-user, per-IP, per-endpoint limits
- **Request Routing**: Path-based routing to appropriate BFF
- **Protocol Translation**: REST ↔ gRPC where needed
### 5.2 GraphQL Federation
The Web BFF uses GraphQL Federation to solve the listing page fan-out problem:

```graphql
# Single query replaces 6 REST calls
query ListingPage($id: ID!) {
  listing(id: $id) {
    title
    description
    photos { url thumbnail }
    host { name avatar responseRate }
    amenities { name icon }
    reviews(first: 10) { rating comment author }
    availability(next: 90) { date available price }
    pricing { basePrice cleaningFee }
  }
}
```
**Trade-off**: Federation adds gateway complexity but eliminates over-fetching and reduces round trips from 6 to 1.

### 5.3 Key API Endpoints
| Endpoint | Method | Service | Description |
| ----- | ----- | ----- | ----- |
| `/graphql`  | POST | Web BFF | Federated GraphQL for web clients |
| `/api/v1/search`  | GET | Search | Listing search with geo/date/filters |
| `/api/v1/listings/{id}`  | GET/PUT | Listings | Listing CRUD |
| `/api/v1/bookings`  | POST | Booking | Create reservation (initiates SAGA) |
| `/api/v1/bookings/{id}`  | GET | Booking | Reservation status |
| `/api/v1/availability/{listing_id}`  | GET | Availability | Calendar availability |
| `/webhooks/stripe`  | POST | Payments | Payment provider callbacks |
### 5.4 Internal Communication
- **Sync (gRPC)**: Service-to-service calls within the critical path (shown as solid lines in architecture diagram)
- **Async (Kafka)**: Event-driven communication for non-blocking operations (shown as dashed lines)
- **Service Mesh**: Istio provides mTLS, retries, circuit breaking, and canary traffic shifting
---

## 6. Security Considerations
### 6.1 Security Architecture
The architecture diagram dedicates Layer 9 to security concerns:

| Control | Implementation | Layer |
| ----- | ----- | ----- |
| **Edge Protection** | WAF + Bot/DDoS mitigation | Gateway |
| **Transport Security** | TLS 1.3 external, mTLS internal (Istio) | All |
| **Authentication** | OAuth2/OIDC via Identity service | Gateway + Services |
| **Authorization** | RBAC with service-level policies | Services |
| **Secrets Management** | HashiCorp Vault / Cloud KMS | Infrastructure |
| **Data Encryption** | At-rest encryption (KMS-managed keys) | Data |
### 6.2 PCI-DSS Compliance
The Payments service operates in an isolated PCI scope:

- **Network Isolation**: Dedicated subnet, restricted ingress/egress
- **Tokenization Only**: Card numbers never touch our systems; Stripe tokens only
- **Audit Logging**: All access logged to immutable store
- **Separate CI/CD**: Dedicated pipeline with additional controls
### 6.3 GDPR Compliance
- **Data Residency**: EU user data pinned to EU Postgres shards
- **Right to Erasure**: Soft-delete with scheduled hard-delete job
- **Data Portability**: Export endpoint for user data
- **Consent Management**: Granular consent tracking in Identity service
### 6.4 Threat Mitigations
| Threat | Mitigation |
| ----- | ----- |
| Credential stuffing | Rate limiting, CAPTCHA, breached password check |
| SQL injection | Parameterized queries, ORM, WAF rules |
| XSS | CSP headers, output encoding, React auto-escaping |
| CSRF | SameSite cookies, CSRF tokens |
| Double-booking | Row-level date locks, SAGA with compensating transactions |
| Fraud | Trust & Safety service with ML scoring, manual review queue |
---

## 7. Testing Strategy
### 7.1 Testing Pyramid
| Level | Scope | Tools | Coverage Target |
| ----- | ----- | ----- | ----- |
| **Unit** | Individual functions, classes | Jest, pytest | 80% line coverage |
| **Integration** | Service + database | Testcontainers | Critical paths |
| **Contract** | API compatibility | Pact | All service boundaries |
| **E2E** | Full user journeys | Playwright | Search → Book → Pay flow |
| **Load** | Performance under stress | k6, Locust | 10× expected peak |
| **Chaos** | Failure resilience | Chaos Mesh | Monthly game days |
### 7.2 Critical Path Testing
The search → listing → booking flow requires synthetic monitoring:

```
1. Search for "Miami beach house, July 4-7"
2. Click first result
3. Verify listing page loads with photos, reviews, availability
4. Select dates, initiate booking
5. Complete payment (test card)
6. Verify confirmation email received
```
**SLO**: This flow must complete in < 30s, 99.5% of the time.

### 7.3 Performance Testing
| Scenario | Target | Test Approach |
| ----- | ----- | ----- |
| Search p95 | < 200ms | Load test with realistic query distribution |
| Booking throughput | 1000 TPS | Spike test simulating flash sale |
| Image CDN | < 500ms TTFB | Global synthetic checks |
| Database failover | < 30s recovery | Chaos engineering with pod kills |
### 7.4 Security Testing
- **SAST**: SonarQube in CI pipeline
- **DAST**: OWASP ZAP weekly scans
- **Dependency Scanning**: Snyk/Dependabot for CVE detection
- **Penetration Testing**: Annual third-party assessment
---

## 8. Rollout Plan
### 8.1 Phase 1: Foundation (Month 1)
**Approach**: Monolith-first for velocity

| Deliverable | Description |
| ----- | ----- |
| Next.js + CDN | SSR/ISR frontend with Cloudflare |
| Single API service | Listings, search (SQL), bookings in one service |
| Single Postgres | All data in one database, read replicas |
| Stripe integration | Tokenization within API service |
| S3 + Image CDN | Photo upload and delivery pipeline |
| Basic observability | Prometheus, Grafana, structured logging |
**Scale ceiling**: ~200 RPS, ~10K listings

### 8.2 Phase 2: Service Extraction (Months 2-4)
**Trigger**: Approaching Phase 1 scale ceiling or team scaling requires ownership boundaries

| Deliverable | Trigger Metric |
| ----- | ----- |
| Extract Identity service | Need for SSO, OAuth provider support |
| Extract Booking service | Booking logic complexity, need for SAGA |
| Extract Messaging service | Chat volume > 10K messages/day |
| Introduce Kafka | > 3 services need booking events |
| Kubernetes migration | Need for independent scaling, canary deploys |
### 8.3 Phase 3: Scale Infrastructure (Months 5-8)
**Trigger**: Performance metrics indicate bottlenecks

| Deliverable | Trigger Metric |
| ----- | ----- |
| Shard Postgres | Sustained > 60% CPU or replication lag > 10s |
| Elasticsearch cluster | Search p95 > 400ms on Postgres |
| Redis cluster | Session/cache volume exceeds single node |
| Cassandra for chat/availability | Write throughput > Postgres capacity |
| Multi-region deployment | Latency requirements for new markets |
### 8.4 Phase 4: Advanced Capabilities (Months 9-12)
**Trigger**: Product requirements for personalization, advanced features

| Deliverable | Trigger Metric |
| ----- | ----- |
| ML Re-Ranker | CTR plateau, product requests personalization |
| GraphQL Federation | BFF complexity, mobile app requirements |
| Advanced fraud detection | Chargeback rate > 0.5% |
| Real-time availability | Double-booking incidents |
### 8.5 Deployment Strategy
As shown in the Deployment & Infrastructure layer of the architecture diagram:

| Aspect | Approach |
| ----- | ----- |
| **Infrastructure as Code** | Terraform for all cloud resources |
| **GitOps** | ArgoCD for Kubernetes deployments |
| **CI/CD** | GitHub Actions with automated testing |
| **Canary Releases** | Istio traffic shifting (1% → 10% → 50% → 100%) |
| **Rollback** | Automated on SLO burn-rate alerts |
| **Multi-region** | Active-active for search/listings; active-passive for payments |
### 8.6 Success Metrics
| Metric | Target | Measurement |
| ----- | ----- | ----- |
| Search p95 latency | < 200ms | Prometheus histogram |
| Booking success rate | > 99.9% | SAGA completion rate |
| Core Web Vitals | LCP < 2.5s, INP < 200ms, CLS < 0.1 | Real User Monitoring |
| Deployment frequency | > 10/day | CI/CD metrics |
| Change failure rate | < 5% | Rollback frequency |
| MTTR | < 30 minutes | Incident tracking |
---

## Appendix A: Technology Decisions
| Decision | Choice | Alternatives Considered | Rationale |
| ----- | ----- | ----- | ----- |
| Frontend framework | Next.js | Remix, SvelteKit | SSR/ISR maturity, Vercel ecosystem |
| API Gateway | Kong/Envoy | AWS API Gateway, Apigee | K8s-native, extensibility |
| Service mesh | Istio | Linkerd, Consul Connect | Feature completeness, observability |
| Message broker | Kafka | RabbitMQ, AWS SQS | Durability, replay, ecosystem |
| Search engine | Elasticsearch | OpenSearch, Algolia | Geo queries, self-hosted control |
| Container orchestration | Kubernetes | ECS, Nomad | Portability, ecosystem |
| IaC | Terraform | Pulumi, CloudFormation | Multi-cloud, maturity |
## Appendix B: Glossary
| Term | Definition |
| ----- | ----- |
| **BFF** | Backend for Frontend — API aggregation layer tailored to client needs |
| **CDC** | Change Data Capture — streaming database changes to event bus |
| **ISR** | Incremental Static Regeneration — Next.js feature for cached SSR |
| **SAGA** | Distributed transaction pattern using compensating transactions |
| **SLO** | Service Level Objective — target reliability metric |
## Appendix C: References
- Architecture diagram: See attached C4-style layered view
- API specifications: OpenAPI specs in `/api-specs`  repository
- Runbooks: `/docs/runbooks`  in operations repository
- ADRs: Architecture Decision Records in `/docs/adr`  


