# BackPump

A backtesting platform for trading strategies on prediction markets. Test grid, momentum, and custom indicator-based strategies against historical market data.

## Features

- **Grid Strategy**: Place buy/sell orders at fixed price intervals
- **Momentum Strategy**: Trade based on price momentum with configurable lookback
- **Custom Strategy**: Build your own using SMA, EMA, RSI, MACD, Bollinger Bands
- **Visual Strategy Editor**: Drag-and-drop workflow builder
- **Continuous Backtesting**: Test across multiple markets in sequence
- **Strategy Persistence**: Save and load strategies locally

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd backtester_processor

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run the API
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to use the app.

## Environment Variables

### Backend (`backtester_processor/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated) | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |

## Production Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.com/api/v1`
4. Deploy

### Backend (VPS with Docker)

```bash
# Clone and enter repo
git clone <your-repo> && cd PredictBack

# Edit Caddyfile with your domain
nano Caddyfile

# Set environment and run
export DB_PASSWORD=your_secure_password
export CORS_ORIGINS=https://your-vercel-app.vercel.app
docker-compose up -d
```

Caddy automatically provisions SSL via Let's Encrypt. Point your domain's DNS to the VPS IP.

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
├── backtester_processor/    # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Backtester engine
│   │   ├── services/       # Business logic
│   │   └── strategies/     # Strategy implementations
│   └── tests/              # Unit tests
├── frontend/               # Next.js frontend
│   └── src/
│       ├── app/            # Pages
│       ├── components/     # React components
│       └── lib/            # API client & utilities
```

## Running Tests

```bash
cd backtester_processor
pytest
```

## License

MIT
