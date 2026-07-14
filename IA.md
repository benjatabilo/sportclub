# DOCUMENTACIÓN DE USO DE IA - PROYECTO "SPORTCLUB"
Benjamín Tabilo  
**Herramientas:**: Gemini  

## 1. INTRODUCCIÓN
El presente documento detalla el apoyo de inteligencia artificial durante el desarrollo del proyecto web "SportClub". La IA fue utilizada exclusivamente como una herramienta de consulta, aprendizaje y refuerzo, permitiéndome entender conceptos complejos de backend, integración de APIs y diseño de interfaces. Todo el código generado por las herramientas fue analizado, adaptado y corregido manualmente para asegurar que se ajustara a la arquitectura de mi proyecto y a las necesidades específicas de la aplicación.

## 2. USO DE IA Y APRENDIZAJE
El uso de la IA  me permitió transicionar de conceptos teóricos a la aplicación práctica en una arquitectura cliente-servidor real. Fue fundamental para desglosar funciones de JavaScript, comprender la asincronía y manejar la comunicación entre el frontend y el backend de forma segura.

## 3. LISTADO DE PROMPTS PRINCIPALES (DESAFÍOS TÉCNICOS)


1. Consumo de API protegida: "¿Cómo realizar una petición `fetch` enviando un Bearer Token desde localStorage?" 

Entendí la estructura de los `headers`. Adapté el código para crear una función `authFetch` reusable.


2. Lógica de navegación: "Cómo diseñar una estructura de layout que tenga Sidebar y área de contenido responsiva": Entendí Flexbox y cómo organizar el layout para que fuera escalable.

3. Eventos asíncronos: "Explícame cómo funciona `async/await` en JavaScript para peticiones a una API":
Entendí que el código no debe bloquearse. Implementé `try/catch` para manejar errores de red. |


4. UI Global (Estilos en JS):"¿Cómo puedo gestionar colores corporativos y fuentes sin usar archivos CSS, sino directamente en los componentes de React?"

Aprendí a centralizar los colores en objetos de configuración y aplicarlos mediante el atributo `style`.


5. Específica (Inline Styling) "¿Cómo puedo ajustar el tamaño de modales y alinear iconos SVG usando solo propiedades `style` en React?".

Aprendí a aplicar estilos dinámicos directamente en JSX, sobreescribiendo valores de Bootstrap con objetos de estilo.

## 4. METODOLOGÍA DE DISEÑO: ESTILOS INTEGRADOS (INLINE STYLING)
El desafío de diseño fue abordado mediante **estilos integrados**, lo cual me permitió mantener toda la lógica de presentación dentro de los componentes. A través de la IA, aprendí a gestionar las propiedades de estilo de React para ajustar la interfaz de forma dinámica. Entendí cómo escalar iconos SVG directamente en el JSX y cómo manipular los tamaños de los modales de Bootstrap mediante objetos de estilo, manteniendo así un código centralizado y sin depender de hojas de estilo externas, lo cual ayudó a mantener un orden lógico y coherente en mi carpeta `src`.

## 5. REFLEXIÓN Y CONCLUSIÓN
La IA fue una ayuda indispensable para comprender la comunicación entre el front-end y el back-end. Mi mayor aprendizaje fue la **depuración**: entender qué hace cada línea, la importancia del `Bearer Token` para la seguridad y cómo manejar estados de carga y error.