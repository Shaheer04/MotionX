FROM python:3.11-bullseye

# Install Node.js 20, FFmpeg, and other system dependencies
RUN apt-get update && apt-get install -y curl ffmpeg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy python dependencies
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright and Chromium along with its dependencies
RUN playwright install --with-deps chromium

# Copy backend application code
COPY . .

# (Optional) We will later copy the Remotion project here and run npm install
# RUN cd remotion_engine && npm install

CMD ["celery", "-A", "worker.celery_app", "worker", "--loglevel=info"]
