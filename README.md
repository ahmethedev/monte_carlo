# Trading Monte Carlo Simulator

A professional trading simulation platform that demonstrates trading is not gambling through Monte Carlo simulations.

## Features

- Real-time trading simulation with WebSocket
- Interactive visualization of trading performance
- Detailed metrics and analytics
- Configurable trading parameters
- Historical performance tracking
- Modern, responsive UI with Tailwind CSS

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: FastAPI + Python
- Database: PostgreSQL
- WebSocket for real-time updates

## Setup

### Backend

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
alembic upgrade head
```

3. Start the server:
```bash
uvicorn monte-server.app.api.main:app --reload
```

### Frontend

1. Install dependencies:
```bash
cd monte-client
npm install
```

2. Create a `.env` file in the client directory:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

3. Start the development server:
```bash
npm start
```

## Usage

1. Configure your trading parameters:
   - Initial Balance
   - Risk per Trade (%)
   - Risk-Reward Ratio
   - Maximum Trades per Day
   - Monthly Cashout Percentage
   - Expected Win Rate
   - Simulation Duration (days)

2. Start the simulation and monitor:
   - Real-time balance updates
   - Daily trading metrics
   - Performance analytics
   - Control simulation speed and pause/resume

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
