from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, Text
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    auth_provider = Column(String, default="anonymous") # "anonymous" | "google"
    google_id = Column(String, unique=True, index=True, nullable=True)
    archetype = Column(String, nullable=True)
    belief_vector = Column(String, nullable=True) # Son vektör JSON string
    gender = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    token = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserTestHistory(Base):
    __tablename__ = "user_test_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    test_type = Column(String, default="short")
    archetype = Column(String, nullable=False)
    similarity_percentage = Column(Integer, nullable=False)
    belief_name = Column(String, nullable=False)
    vector_5d = Column(String, nullable=False) # JSON
    created_at = Column(DateTime, default=datetime.utcnow)

class MatchSession(Base):
    __tablename__ = "match_sessions"

    id = Column(String, primary_key=True, index=True)
    user1_name = Column(String)
    user2_name = Column(String)
    user2_archetype = Column(String)
    user2_gender = Column(String)
    compatibility = Column(Integer)
    intent = Column(String)
    is_revealed = Column(Boolean, default=False)
    reveal_requested_by = Column(String, nullable=True)
    is_ai_companion = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    sender = Column(String) # "user", "partner", "system"
    sender_name = Column(String)
    text = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
