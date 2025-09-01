# 🐶 Galería de Perros Aleatorios

Este proyecto es una aplicación web desarrollada con *Flask* que consume la API pública de [Dog CEO](https://dog.ceo/dog-api/) para mostrar imágenes aleatorias de perros.  
El usuario puede generar nuevas imágenes al hacer clic en un botón y ver un historial de las imágenes consultadas.  

---

## 🚀 Tecnologías utilizadas
- *Python 3*  
- *Flask* (backend web)  
- *Requests* (para consumir la API)  
- *HTML5, CSS3, JavaScript* (frontend)  

---

## 📂 Estructura del proyecto
proyecto-perros/
│── app.py # Servidor principal en Flask
│── requirements.txt # Dependencias del proyecto
│── static/ # Archivos estáticos (JS, CSS, imágenes)
│ ├── style.css
│ └── script.js
│── templates/ # Vistas HTML (Jinja2)
│ └── index.html

## ⚡ Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/proyecto-perros.git
   cd proyecto-perros

   Crear y activar un entorno virtual (opcional, pero recomendado):
python -m venv venv
venv\Scripts\activate      # Windows

Instalar dependencias:
pip install -r requirements.txt
Levantar el servidor Flask:

flask run
