"""esquema inicial

Revision ID: 37bf00893bb9
Revises: 
Create Date: 2026-11-23 12:11:17.147115

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '37bf00893bb9'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "reflections",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("quote", sa.Text(), nullable=False, unique=True),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("action", sa.Text(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False, server_default="draft"),
        sa.Column("source", sa.Text(), nullable=False, server_default="human"),
        sa.Column("reviewed_by", sa.Text(), nullable=True),
        sa.Column(
            "mood_tags",
            postgresql.ARRAY(sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'"),
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint(
            "status IN ('draft', 'ai_generated', 'reviewed', 'published')",
            name="ck_reflections_status",
        ),
        sa.CheckConstraint("source IN ('human', 'ai')", name="ck_reflections_source"),
    )
    op.create_table(
        "daily_reflections",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("date", sa.Date(), nullable=False, unique=True),
        sa.Column("reflection_id", sa.Integer(), sa.ForeignKey("reflections.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("daily_reflections")
    op.drop_table("reflections")
