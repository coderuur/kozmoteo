from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    gender = Column(String)
    belief_vector = Column(String)  # Vektörleri JSON formatında metin olarak tutarız
    is_verified = Column(Boolean, default=False)
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
