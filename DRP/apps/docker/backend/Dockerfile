# Utilise l'image officielle Python 3.10-slim
FROM python:3.10-slim

# Définit le répertoire de travail
WORKDIR /apps/backend

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    git build-essential \
    libgdal-dev gdal-bin \
    proj-bin libproj-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Définir les variables d'environnement pour GDAL et PROJ
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal
ENV PROJ_LIB=/usr/share/proj

# Copier le fichier .env dans le conteneur
COPY .env .env

# Copier requirements.txt avant les autres fichiers
COPY ./apps/backend/requirements.txt .

# Installer les anciennes versions de pip et setuptools pour compatibilité
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade "pip<23" "setuptools<58" && \
    /opt/venv/bin/pip install -r requirements.txt

# Copier le reste du code après l'installation des dépendances
COPY ./apps/backend .

# Rendre le script d'entrée exécutable
RUN chmod +x /apps/backend/entrypoint.sh

# Assurer que le venv est utilisé par défaut
ENV PATH="/opt/venv/bin:$PATH"

# Point d'entrée du conteneur
CMD [ "/apps/backend/entrypoint.sh" ]
