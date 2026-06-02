FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DB_PATH=/app/data/db.sqlite3

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . .

RUN mkdir -p /app/data

VOLUME ["/app/data"]

EXPOSE 8000

CMD ["sh", "-c", \
    "python manage.py migrate && \
     python manage.py seed_drinklivery_panama && \
     python manage.py runserver 0.0.0.0:8000"]
