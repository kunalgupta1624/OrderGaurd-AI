from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.api.order import router as orders_router
from app.api.dashboard import router as dashboard_router
from app.api.settings import router as settings_router

from app.schemas.order import OrderRequest
from app.services.order_service import OrderEvaluationService


app = FastAPI(
    title="OrderGuard AI",
    description="AI-powered COD RTO prevention system",
    version="1.0.0"
)


# CORS Configuration

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Register API Routers

app.include_router(orders_router)
app.include_router(dashboard_router)
app.include_router(settings_router)


# Initialize Order Evaluation Service

order_service = OrderEvaluationService()


# Root Endpoint

@app.get("/")
def root():
    return {
        "message": "Welcome to OrderGuard AI",
        "status": "running"
    }


# Health Check

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# Evaluate Order

@app.post("/api/orders/evaluate")
def evaluate_order(order: OrderRequest):

    try:
        return order_service.evaluate_order(
            order=order.model_dump()
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )