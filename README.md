📑 Project Report: Multi-Tenant Rental & Project Management System
1. Introduction

This project aims to build a multi-tenant SaaS application for managing projects, equipment, crew, customers, and warehouses for the stage/event rental industry.
It will support barcode/QR scanning, financial integrations (with Fiken), inventory management, and collaboration across multiple organizations.

The system will replace spreadsheets and manual processes with a unified platform, supporting both internal use (Nordic Events) and external clients as a SaaS product.

2. Goals & Scope
Primary Goals

Centralize management of projects, equipment, customers, crew, and warehouses.

Enable multi-organization support with strict data isolation.

Automate invoicing, offers, and billing through Fiken API integration.

Provide real-time equipment tracking with barcode/QR codes.

Offer warehouse & logistics tools (pack zones, scanning in/out).

Ensure mobile-friendly workflows for crew and warehouse staff.

Out of Scope (Phase 1)

Deep accounting (handled by Fiken).

Full HR/payroll.

AI-based forecasting (can be a later feature).

3. System Architecture
3.1 Architecture Overview

Frontend (Web App):

Next.js + React + Tailwind + TypeScript

Mobile responsive for warehouse staff

Role-based UI (Admin, Crew, Warehouse, Finance)

Backend (API):

Node.js + NestJS (or Fastify/Express with TypeScript)

REST/GraphQL API with Swagger/OpenAPI docs

Multi-tenant middleware for data isolation

Integrations: Fiken API, Stripe (future payments), printing

Database:

PostgreSQL with Row Level Security (RLS) for tenant isolation

Prisma ORM for schema management and migrations

Storage & Files:

S3-compatible storage (AWS S3, MinIO, or Wasabi)

Used for invoices, receipts, and attachments

Scanning & Printing:

QR/barcode scanning via web/mobile camera

Zebra printer integration for stickers and labels

PDF generation for pack lists, invoices, and barcodes

Hosting/Infra:

Dockerized deployment (Portainer, Kubernetes, or Fly.io/Render for SaaS)

Monitoring: Prometheus + Grafana (or SaaS equivalent)

Logging: Loki/ELK stack

4. Multi-Tenant Strategy

Tenancy Model:

Shared schema, tenant_id column on every table

Row Level Security (RLS) in PostgreSQL to enforce data isolation

Future upgrade path to per-tenant database if required

Authentication & Authorization:

OAuth2/JWT-based auth (Auth0, Clerk, or custom)

users table stores system users

org_users table links users to orgs with roles

Permissions at org-level and feature-level (Projects, Equipment, Finance, etc.)

5. Database Schema (High Level)
Key Entities

Organizations (orgs) – SaaS tenants

Users (users) – global user accounts

Org Users (org_users) – mapping of users to orgs & roles

Projects (projects) – core business entity

Equipment (equipment, equipment_serials) – inventory tracking

Customers (customers, contacts) – client management

Crew (crew, roles) – internal & external staff

Warehouses (warehouses, shelves, pack_zones) – logistics handling

Scans (scans) – equipment check-in/out history

Financial (invoices, offers) – mapped to Fiken API IDs

History Logs (history_logs) – audit trail

6. Financial Integration (Fiken)
Flow

Tenant admin connects Fiken via OAuth2.

App stores Fiken tokens per org.

Project financials (equipment cost, crew hours, consumables, additional cost) are aggregated.

User clicks Create Invoice / Offer → App sends payload to Fiken API.

Fiken returns invoice/offer ID + PDF link.

App stores mapping in invoices table for history and auditing.

Benefits

✅ Legal compliance for invoicing in Norway

✅ Reduces duplicate bookkeeping

✅ Multi-tenant friendly (each org connects own Fiken account)

7. Features (Module Breakdown)
7.1 Projects

Create projects with general info, client, tasks, crew, equipment, schedule.

Assign warehouse and pack zones.

Track project lifecycle (Inquiry → Confirmed → On Location → Returned).

7.2 Equipment

Bulk vs Serialized items.

Equipment groups and consumables.

Track availability, warehouse shelf location.

Generate and print QR/barcodes.

7.3 Customers

Manage customers, org numbers, VAT IDs.

Add multiple contact persons.

Store delivery addresses.

7.4 Crew

Add crew members, external crew, and groups.

Store hourly rates, bank details, emergency contact.

Assign crew to projects.

7.5 Warehouse

Manage warehouses, shelves, and pack zones.

Pack zone display (like airport gate screen).

Track equipment location changes.

7.6 Financial

Integrate with Fiken for offers and invoices.

Upload receipts for additional costs.

Overview of project costs.

7.7 Scanning

Scan-in/out equipment using QR/barcodes.

Auto-update project status when equipment is returned.

Change shelf assignment via scan.

Force status change (In use, Available, Maintenance, Lost).

7.8 Printing

Print pack lists.

Print equipment stickers.

Print shelf barcodes.

8. Roadmap & Phases
Phase 1 (MVP, ~8–12 weeks)

Core: Multi-tenant auth, Projects, Equipment, Customers, Crew, Warehouse.

Scanning in/out with camera.

Printing: Pack list + equipment stickers.

Fiken integration: create invoices/offers.

Phase 2 (~12–16 weeks)

Advanced features: Equipment groups, consumables, temp items.

Pack zone display.

Audit log/history.

More detailed financial overview.

Phase 3 (~6 months+)

SaaS polish: Tenant self-signup, billing plans, Stripe subscription integration.

Advanced reporting & analytics.

Multi-language, multi-currency.

Mobile-native app for offline scanning.

9. Security & Compliance

Row Level Security (RLS) to isolate tenant data.

TLS for all traffic.

Role-based access control.

Encrypted file storage.

Daily backups with per-tenant restore.

GDPR-compliant data retention and deletion policies.
