# Utilisation d'une image de base plus récente et légère
FROM node:20-slim

# Met à jour les paquets et installe les dépendances nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  git \
  libfontconfig \
  ruby \
  ruby-dev \
  python3 \
  python3-dev \
  && rm -rf /var/lib/apt/lists/*

# Mise à jour de npm pour la dernière version
RUN npm install -g npm@latest

# Mise à jour des outils npm, installation de grunt-cli et bower
RUN npm install -g grunt-cli bower

# Nettoyage du cache npm pour éviter les conflits
RUN npm cache clean --force

# Installation des gems nécessaires avec versions spécifiques
RUN gem install ffi -v 1.9.18 && \
    gem install sass -v 3.4.22 && \
    gem install rb-inotify -v 0.9.10 && \
    gem install compass

# Création des répertoires nécessaires
RUN mkdir -p /opt/schema_editor /npm /bower

# Installation des dépendances npm
WORKDIR /npm
COPY package.json /npm/
RUN npm install --legacy-peer-deps

# Installation des dépendances bower
WORKDIR /bower
COPY bower.json /bower/
RUN bower install --allow-root --config.interactive=false --force

# Copie des fichiers de l'application
WORKDIR /opt/schema_editor
COPY . /opt/schema_editor

# Exécution de grunt à l'exécution du container
ENTRYPOINT ["grunt"]
