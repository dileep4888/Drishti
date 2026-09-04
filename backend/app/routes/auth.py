from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy.orm import Session
from enum import Enum

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


class UserRole(str, Enum):
    inspector = "inspector"
    pmu_admin = "pmu_admin"
    department_official = "department_official"
    ngo_incharge = "ngo_incharge"


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str
    role: UserRole  # Only allow self-registration for inspector and ngo_incharge
    phone: str | None = Field(default=None, pattern=r"^\+?[6-9]\d{9}$")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v

    @field_validator("role")
    @classmethod
    def restrict_admin_registration(cls, v):
        # Prevent privilege escalation — only allow self-registration for non-admin roles
        if v in [UserRole.pmu_admin, UserRole.department_official]:
            raise ValueError("Admin roles cannot be self-registered. Contact system administrator.")
        return v


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role.value,  # Extract enum value
        phone=payload.phone,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"user_id": user.id, "role": user.role})
    return TokenResponse(access_token=token, role=user.role, name=user.name)


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm uses "username" as the field name — we treat it as email.
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token({"user_id": user.id, "role": user.role})
    return TokenResponse(access_token=token, role=user.role, name=user.name)
