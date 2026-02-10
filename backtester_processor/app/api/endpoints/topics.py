"""
Topics and Markets API endpoints.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.config import settings
from app.repository.polymarket import PolymarketRepository
from app.schemas.backtest import TopicsResponse, Topic, MarketsResponse, MarketInfo, SubtopicsResponse, SubtopicInfo

router = APIRouter()


def get_repository() -> PolymarketRepository:
    """Get repository instance."""
    return PolymarketRepository(settings.database_url)


@router.get("/", response_model=TopicsResponse, response_model_exclude_none=True)
async def get_topics() -> TopicsResponse:
    """
    Get all available topics/categories.

    Returns a list of all topics that can be used to filter markets.
    Topics are grouped by name with subtopic count.
    Only includes topics with at least one market.
    """
    repo = get_repository()
    topics_data = repo.get_topics()

    topics = [
        Topic(
            name=t["name"],
            continuous=t["continuous"],
            created_at=t["created_at"],
            # Only show subtopic_count if it's greater than 0, otherwise set to None
            subtopic_count=t.get("subtopic_count", 0) if t.get("subtopic_count", 0) > 0 else None,
        )
        for t in topics_data
    ]

    return TopicsResponse(topics=topics, count=len(topics))


@router.get("/{topic}/subtopics", response_model=SubtopicsResponse)
async def get_subtopics(topic: str) -> SubtopicsResponse:
    """
    Get all subtopics for a given topic.

    Args:
        topic: Topic name

    Returns:
        List of subtopics with their metadata
    """
    repo = get_repository()
    subtopics_data = repo.get_subtopics_for_topic(topic)

    subtopics = [
        SubtopicInfo(
            subtopic=s["subtopic"],
            continuous=s["continuous"],
            created_at=s["created_at"],
        )
        for s in subtopics_data
    ]

    return SubtopicsResponse(
        topic=topic,
        subtopics=subtopics,
        count=len(subtopics),
    )


@router.get("/markets", response_model=MarketsResponse)
async def get_markets(
    topic: Optional[str] = Query(default=None, description="Filter markets by topic name"),
    subtopic: Optional[str] = Query(default=None, description="Filter markets by subtopic")
) -> MarketsResponse:
    """
    Get all indexed markets, optionally filtered by topic and subtopic.

    Args:
        topic: Optional topic name to filter markets
        subtopic: Optional subtopic to filter markets
    """
    repo = get_repository()

    if topic:
        markets_data = repo.get_markets_by_topic(topic, subtopic)
    else:
        markets_data = repo.get_indexed_markets()

    markets = [
        MarketInfo(
            clob_token_id=m["clob_token_id"],
            market_slug=m.get("market_slug"),
            question=m.get("question"),
            neg=m["neg"],
            topic=m.get("topic"),
            subtopic=m.get("subtopic"),
        )
        for m in markets_data
    ]

    return MarketsResponse(markets=markets, count=len(markets))
