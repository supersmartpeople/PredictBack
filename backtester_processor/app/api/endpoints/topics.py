"""
Topics and Markets API endpoints.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.config import settings
from app.repository.polymarket import PolymarketRepository
from app.schemas.backtest import TopicsResponse, Topic, MarketsResponse, MarketInfo, SubtopicsResponse, SubtopicInfo

router = APIRouter()


# Topic metadata configuration: display order, icon URLs, and negrisk flag
_S3 = "https://polymarket-upload.s3.us-east-2.amazonaws.com"

TOPIC_CONFIG = {
    "BTC": {
        "sort_order": 1,
        "icon_url": f"{_S3}/BTC+fullsize.png",
        "negrisk": False,
    },
    "ETH": {
        "sort_order": 2,
        "icon_url": f"{_S3}/ETH+fullsize.jpg",
        "negrisk": False,
    },
    "SOL": {
        "sort_order": 3,
        "icon_url": f"{_S3}/SOL+fullsize.png",
        "negrisk": False,
    },
    "EFL": {
        "sort_order": 4,
        "icon_url": f"{_S3}/english-premier-league-winner-VFcNkpZeA9Sz.jpg",
        "negrisk": True,
    },
    "NBA Finals 2026": {
        "sort_order": 5,
        "icon_url": f"{_S3}/nba-finals-points-leader-7g2ZEZvMXxLb.jpg",
        "negrisk": True,
    },
    "NBA Games 2025-2026": {
        "sort_order": 6,
        "icon_url": f"{_S3}/super+cool+basketball+in+red+and+blue+wow.png",
        "negrisk": True,
    },
    "US Presidential Elections": {
        "sort_order": 7,
        "icon_url": f"{_S3}/presidential-election-winner-2024-afdda358-219d-448a-abb5-ba4d14118d71.png",
        "negrisk": True,
    },
    "Republican Presidential Nominee 2028": {
        "sort_order": 8,
        "icon_url": f"{_S3}/republicans+2028.png",
        "negrisk": True,
    },
    "Democratic Presidential Nominee 2028": {
        "sort_order": 9,
        "icon_url": f"{_S3}/democrats+2028+donkey.png",
        "negrisk": True,
    },
    "Will Solana Reach ___?": {
        "sort_order": 10,
        "icon_url": f"{_S3}/SOL+fullsize.png",
        "negrisk": False,
    },
    "Jesus": {
        "sort_order": 11,
        "icon_url": f"{_S3}/will-jesus-christ-return-in-2025-qulWN7QCehv8.jpg",
        "negrisk": False,
    },
    "Elon Tweets": {
        "sort_order": 12,
        "icon_url": f"{_S3}/elon-musk-of-tweets-nov-22-29-apMPG21-pzx_.jpg",
        "negrisk": True,
    },
    "War": {
        "sort_order": 13,
        "icon_url": f"{_S3}/russia-x-ukraine-ceasefire-in-2025-w2voYOygx80B.jpg",
        "negrisk": False,
    },
    "Portugal Elections": {
        "sort_order": 14,
        "icon_url": f"{_S3}/portugal-presidential-election-_h_A97vllNOX.png",
        "negrisk": True,
    },
    "2024 US Presidential Election": {
        "sort_order": 15,
        "icon_url": f"{_S3}/presidential-election-winner-2024-afdda358-219d-448a-abb5-ba4d14118d71.png",
        "negrisk": False,
    },
    "Who will Trump nominate as Fed Chair?": {
        "sort_order": 16,
        "icon_url": f"{_S3}/who-will-trump-nominate-as-fed-chair-9p19ttRwsbKL.png",
        "negrisk": True,
    },
    "Fed Rates": {
        "sort_order": 17,
        "icon_url": f"{_S3}/jerome+powell+glasses1.png",
        "negrisk": True,
    },
    "College Basketball": {
        "sort_order": 18,
        "icon_url": f"{_S3}/acc-mens-college-basketball-2025-2026-regular-season-champion-Nng3sB98uBue.jpg",
        "negrisk": True,
    },
    "Champions League": {
        "sort_order": 19,
        "icon_url": f"{_S3}/uefa-champions-league-2025-26-which-teams-qualify-StbSIjaEx2St.png",
        "negrisk": True,
    },
}


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
    date_ranges = repo.get_topic_date_ranges()

    topics = []
    for t in topics_data:
        name = t["name"]
        config = TOPIC_CONFIG.get(name, {})
        dr = date_ranges.get(name)
        date_range_str = None
        if dr and dr["min_date"] and dr["max_date"]:
            min_d = dr["min_date"].strftime("%d %b %Y")
            max_d = dr["max_date"].strftime("%d %b %Y")
            date_range_str = f"{min_d} - {max_d}"

        topics.append(Topic(
            name=name,
            continuous=t["continuous"],
            created_at=t["created_at"],
            subtopic_count=t.get("subtopic_count", 0) if t.get("subtopic_count", 0) > 0 else None,
            icon_url=config.get("icon_url"),
            date_range=date_range_str,
            sort_order=config.get("sort_order", 999),
            negrisk=config.get("negrisk"),
        ))

    topics.sort(key=lambda t: t.sort_order or 999)

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
