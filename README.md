# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# SportClub --

Se crea un Sistema web dinámico para la evaluación de Programación Front End. Este proyecto representa una plataforma deportiva denominada SportClub, que incluye una Landing Page, autenticación de usuarios basada en JWT y dashboards diferenciados según el rol del usuario (Administrador, Coach, Usuario).

# Descripción del Proyecto

SportClub es una aplicación web de página única desarrollada en React, orientada a la gestión de usuarios, salas, disciplinas y horarios de entrenamiento. A diferencia de una web estática, esta versión interactúa con una API REST para la gestión real de datos y persistencia de sesión.

El sistema incluye:
- Landing Page informativa con planes y beneficios.
- Autenticación segura (Login/Registro).
- Dashboard Administrador: Gestión de usuarios, salas y asignaciones.
- Dashboard Coach/Usuario: Acceso a clases y actividades personalizadas.

# Tecnologías Utilizadas

- React.js (Componentes funcionales)
- React Router (Navegación SPA)
- React-Bootstrap (Diseño de interfaz y componentes)
- API REST (Consumo mediante fetch asíncrono)
- LocalStorage (Persistencia de sesión y tokens)
- SweetAlert2 (Notificaciones y feedback de usuario)

# Estructura del Proyecto

/src/components = Componentes reutilizables (Modales, Badges, Tablas, Iconos)
/src/pages      = Vistas principales de la aplicación
/src/services   = Lógica de conexión a API y servicios de autenticación
App.js          = Configuración de rutas
index.js        = Punto de entrada
README.md       = Documentación del proyecto
IA.md           = Registro de apoyo de IA

# Funcionalidades Principales

## Landing Page
- Presentación del club, servicios y planes con diseño responsive y efectos interactivos.

## Sistema de Autenticación
- Login y Registro con validación en tiempo real.
- Manejo seguro de tokens en LocalStorage.
- Protección de rutas: Redirección automática si no existe sesión válida.

## Dashboard Administrativo
- Gestión dinámica: CRUD completo para Salas y Asignaciones (Deporte-Sala-Coach).
- Renderizado de datos en tiempo real mediante consumo de API.
- Identificación visual de estados de salas y asignaciones.

# Características Técnicas Avanzadas

- Arquitectura SPA: Navegación fluida sin recargas de página.
- Estilos Integrados (Inline Styling): Gestión de interfaz directamente en los componentes para mantener la lógica de presentación centralizada, utilizando variables de color corporativas.
- Manejo de asincronía: Implementación robusta de `async/await` con `try/catch` para depuración de errores HTTP.
- Comunicación API: Capa de abstracción (`apiFetch.js`) para peticiones seguras con `Bearer Token`.
- Validación de datos: Limpieza y validación de metadatos JSON recibidos del servidor antes de su renderizado.

---
# PARTE 2 EV: INTEGRACIÓN Y DINAMISMO

La segunda etapa evolucionó el proyecto hacia una plataforma dinámica conectada a un servidor Express (localhost:3000).

# Principales avances:

- Conectividad real: Integración total con API REST para la gestión de datos.
- Seguridad: Flujo de login persistente con manejo seguro de sesiones.
- Gestión de entidades: CRUD avanzado de Salas y Asignaciones con validaciones robustas.
- Feedback de usuario: Integración de alertas profesionales mediante SweetAlert2 tras cada operación exitosa o error de servidor.

# DISEÑOS DEASHBOARD
Para los dashboards se penso y se plasmo la idea en CANVA, para tener un camino de que datos, y que contenido diseñar en cada dashboard.

