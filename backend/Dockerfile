FROM python:3.13-slim

WORKDIR /app

# системные зависимости (psycopg2 / asyncpg build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# обновляем pip
RUN pip install --upgrade pip

# копируем зависимости
COPY requirements.txt .

# ставим зависимости
RUN pip install --no-cache-dir -r requirements.txt

# копируем код
COPY ./app ./app