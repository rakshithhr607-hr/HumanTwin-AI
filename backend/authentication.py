import os
import sqlite3
import hashlib
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


AUTH_DB = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "auth.db"
)


def get_connection():
    connection = sqlite3.connect(AUTH_DB)
    connection.row_factory = sqlite3.Row
    return connection


def init_auth_db():
    connection = get_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        """
    )

    connection.commit()
    connection.close()


init_auth_db()


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)

    password_hash = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=16384,
        r=8,
        p=1
    )

    return salt.hex() + ":" + password_hash.hex()


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt_hex, hash_hex = stored_hash.split(":")

        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(hash_hex)

        actual_hash = hashlib.scrypt(
            password.encode("utf-8"),
            salt=salt,
            n=16384,
            r=8,
            p=1
        )

        return secrets.compare_digest(
            actual_hash,
            expected_hash
        )

    except Exception:
        return False


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
def register(data: RegisterRequest):

    if len(data.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters."
        )

    name = data.name.strip()
    email = data.email.lower().strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required."
        )

    connection = get_connection()

    existing_user = connection.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    if existing_user:
        connection.close()

        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    password_hash = hash_password(data.password)

    cursor = connection.execute(
        """
        INSERT INTO users
        (name, email, password_hash, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (
            name,
            email,
            password_hash,
            datetime.now(timezone.utc).isoformat()
        )
    )

    user_id = cursor.lastrowid

    connection.commit()
    connection.close()

    return {
        "message": "Registration successful.",
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    }


@router.post("/login")
def login(data: LoginRequest):

    email = data.email.lower().strip()

    connection = get_connection()

    user = connection.execute(
        """
        SELECT id, name, email, password_hash
        FROM users
        WHERE email = ?
        """,
        (email,)
    ).fetchone()

    if not user:
        connection.close()

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if not verify_password(
        data.password,
        user["password_hash"]
    ):
        connection.close()

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    token = secrets.token_urlsafe(32)

    connection.execute(
        """
        INSERT INTO sessions
        (token, user_id, created_at)
        VALUES (?, ?, ?)
        """,
        (
            token,
            user["id"],
            datetime.now(timezone.utc).isoformat()
        )
    )

    connection.commit()
    connection.close()

    return {
        "message": "Login successful.",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }


@router.post("/logout")
def logout(token: str):

    connection = get_connection()

    connection.execute(
        "DELETE FROM sessions WHERE token = ?",
        (token,)
    )

    connection.commit()
    connection.close()

    return {
        "message": "Logged out successfully."
    }


@router.get("/me")
def get_current_user(token: str):

    connection = get_connection()

    user = connection.execute(
        """
        SELECT
            users.id,
            users.name,
            users.email
        FROM sessions
        JOIN users
            ON users.id = sessions.user_id
        WHERE sessions.token = ?
        """,
        (token,)
    ).fetchone()

    connection.close()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session."
        )

    return {
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }