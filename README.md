# n-world-bank-conversational-backend

Este repositorio contiene la arquitectura de backend basada en microservicios para el bot conversacional de Banca, desarrollado por n.world/business.

## Estructura del proyecto

- **auth-service**: Servicio de autenticación y autorización.
- **nlp-connector**: Conector con el motor NLP (ej. Dialogflow).
- **conversation-service**: Gestión del contexto conversacional.
- **banking-services**: Microservicios bancarios (cuentas, transferencias).
- **infrastructure**: Scripts de despliegue, Dockerfiles, K8s, etc.
- **docs**: Documentación, OpenAPI, diagramas.
- **scripts**: Herramientas auxiliares.
- **tests**: Pruebas unitarias, integración y carga.
- **.github/workflows**: Pipelines CI/CD con GitHub Actions.

## Tecnologías y Herramientas

- Docker, Kubernetes
- CI/CD con GitHub Actions
- Autenticación RBAC + MFA
- Log y Auditoría centralizados
- Cumplimiento normativo (GDPR)


