"""
Repository for Polymarket database operations.
Handles creating tables and inserting trade data.
"""

import os
from typing import Optional
from contextlib import contextmanager

import psycopg2
from psycopg2.extras import execute_values


import re


def get_table_suffix(clob_token_id: str) -> str:
    """Extract first 15 characters of clob_token_id for table name."""
    return clob_token_id[:15]


def get_table_name(clob_token_id: str) -> str:
    """Get the full table name for a market."""
    return f"hist_trades_{get_table_suffix(clob_token_id)}"


def parse_continuous_slug(market_slug: str) -> tuple[str, int] | None:
    """
    Parse a continuous market slug to extract category prefix and timestamp.

    Example: 'btc-updown-15m-1770093900' -> ('btc-updown-15m', 1770093900)

    Returns None if slug doesn't match the expected pattern.
    """
    if not market_slug:
        return None

    # Match pattern: anything-followed-by-a-number at the end
    match = re.match(r'^(.+)-(\d+)$', market_slug)
    if match:
        prefix = match.group(1)
        timestamp = int(match.group(2))
        return (prefix, timestamp)
    return None


class PolymarketRepository:
    """Repository for Polymarket trade data."""

    def __init__(self, database_url: Optional[str] = None):
        self.database_url = database_url or os.environ.get("DATABASE_URL")
        if not self.database_url:
            raise ValueError("DATABASE_URL not set in environment")
        self._table_name_cache = {}  # Cache for table name lookups
        self._init_db()

    def get_table_name_for_market(self, clob_token_id: str) -> str:
        """
        Get table name using YES token ID from hist_markets.
        Falls back to clob_token_id if no YES token mapping exists.
        """
        # Check cache first
        if clob_token_id in self._table_name_cache:
            return self._table_name_cache[clob_token_id]

        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT yes_token_id
                    FROM hist_markets
                    WHERE clob_token_id = %s
                """, (clob_token_id,))
                result = cur.fetchone()

                if result and result[0]:
                    # Use YES token ID for table name
                    yes_token_id = result[0]
                    table_name = f"hist_trades_{yes_token_id[:15]}"
                else:
                    # Fallback to old naming
                    table_name = get_table_name(clob_token_id)

                # Cache the result
                self._table_name_cache[clob_token_id] = table_name
                return table_name

    def _init_db(self):
        """Initialize database tables if they don't exist."""
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                # Create topics table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS topics (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        subtopic VARCHAR(255),
                        continuous BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE (name, subtopic)
                    )
                """)
                cur.execute("CREATE INDEX IF NOT EXISTS idx_topics_name ON topics(name)")
                cur.execute("CREATE INDEX IF NOT EXISTS idx_topics_name_subtopic ON topics(name, subtopic)")

                # Create hist_markets table with foreign key to topics
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS hist_markets (
                        clob_token_id VARCHAR(100) PRIMARY KEY,
                        market_slug VARCHAR(255),
                        question TEXT,
                        neg BOOLEAN DEFAULT FALSE,
                        topic_id INTEGER REFERENCES topics(id)
                    )
                """)
                cur.execute("CREATE INDEX IF NOT EXISTS idx_market_slug ON hist_markets(market_slug)")
                cur.execute("CREATE INDEX IF NOT EXISTS idx_market_topic ON hist_markets(topic_id)")

                # Create function for dynamic table creation
                cur.execute("""
                    CREATE OR REPLACE FUNCTION create_hist_trades_table(table_suffix VARCHAR(15))
                    RETURNS VOID AS $$
                    DECLARE
                        tbl_name TEXT;
                    BEGIN
                        tbl_name := 'hist_trades_' || table_suffix;
                        EXECUTE format('
                            CREATE TABLE IF NOT EXISTS %I (
                                id SERIAL PRIMARY KEY,
                                tx_hash VARCHAR(66) NOT NULL,
                                block_number BIGINT,
                                block_time TIMESTAMP,
                                maker VARCHAR(42),
                                taker VARCHAR(42),
                                maker_asset_id VARCHAR(100),
                                taker_asset_id VARCHAR(100),
                                maker_amount_filled NUMERIC(78, 0),
                                taker_amount_filled NUMERIC(78, 0),
                                fee NUMERIC(78, 0),
                                side VARCHAR(10),
                                price NUMERIC(20, 10),
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                UNIQUE(tx_hash, maker, taker, maker_amount_filled)
                            )', tbl_name);
                        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_block_time ON %I(block_time)', table_suffix, tbl_name);
                        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_maker ON %I(maker)', table_suffix, tbl_name);
                        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_taker ON %I(taker)', table_suffix, tbl_name);
                    END;
                    $$ LANGUAGE plpgsql
                """)

    @contextmanager
    def get_connection(self):
        """Context manager for database connections."""
        conn = psycopg2.connect(self.database_url)
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def create_market_table(self, clob_token_id: str) -> str:
        """
        Create a hist_trades table for a specific market.
        Returns the table name.
        """
        table_suffix = get_table_suffix(clob_token_id)
        table_name = get_table_name(clob_token_id)

        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT create_hist_trades_table(%s)", (table_suffix,))

        return table_name

    # ==================== TOPICS ====================

    def add_topic(self, name: str, continuous: bool = False, subtopic: Optional[str] = None) -> int:
        """
        Add a new topic to the topics table.
        Returns the topic id.

        Args:
            name: Topic name
            continuous: Whether this is a continuous market topic
            subtopic: Optional subtopic identifier
        """
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                # Handle both nullable and non-null subtopic cases for ON CONFLICT
                if subtopic is not None:
                    cur.execute(
                        """
                        INSERT INTO topics (name, continuous, subtopic)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (name, subtopic) WHERE subtopic IS NOT NULL
                        DO UPDATE SET continuous = EXCLUDED.continuous
                        RETURNING id
                        """,
                        (name, continuous, subtopic),
                    )
                else:
                    cur.execute(
                        """
                        INSERT INTO topics (name, continuous, subtopic)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (name) WHERE subtopic IS NULL
                        DO UPDATE SET continuous = EXCLUDED.continuous
                        RETURNING id
                        """,
                        (name, continuous, subtopic),
                    )
                return cur.fetchone()[0]

    def get_topic_id(self, name: str) -> Optional[int]:
        """
        Get the topic id by name (without subtopic).
        For backwards compatibility - gets topic with NULL subtopic.
        """
        return self.get_topic_id_with_subtopic(name, None)

    def get_topic_id_with_subtopic(self, name: str, subtopic: Optional[str] = None) -> Optional[int]:
        """
        Get the topic id by name and subtopic.

        Args:
            name: Topic name
            subtopic: Optional subtopic identifier

        Returns:
            Topic ID or None if not found
        """
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                if subtopic is not None:
                    cur.execute(
                        "SELECT id FROM topics WHERE name = %s AND subtopic = %s",
                        (name, subtopic)
                    )
                else:
                    cur.execute(
                        "SELECT id FROM topics WHERE name = %s AND subtopic IS NULL",
                        (name,)
                    )
                result = cur.fetchone()
                return result[0] if result else None

    def topic_exists(self, name: str) -> bool:
        """Check if a topic exists."""
        return self.get_topic_id(name) is not None

    def get_subtopics_for_topic(self, name: str) -> list[dict]:
        """
        Get all subtopics for a given topic name that have at least one market.

        Args:
            name: Topic name

        Returns:
            List of subtopic dicts with id, name, subtopic, continuous, created_at
        """
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT t.id, t.name, t.subtopic, t.continuous, t.created_at
                    FROM topics t
                    WHERE t.name = %s AND t.subtopic IS NOT NULL
                    AND EXISTS (
                        SELECT 1 FROM hist_markets m WHERE m.topic_id = t.id
                    )
                    ORDER BY t.subtopic
                    """,
                    (name,)
                )
                columns = [desc[0] for desc in cur.description]
                return [dict(zip(columns, row)) for row in cur.fetchall()]

    def get_topics(self) -> list[dict]:
        """
        Get all topics grouped by name.
        Returns distinct topic names with subtopic count.
        Only includes topics that have at least one market.
        """
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    WITH topic_market_counts AS (
                        SELECT
                            t.name,
                            t.subtopic,
                            t.continuous,
                            t.created_at,
                            COUNT(m.clob_token_id) as market_count
                        FROM topics t
                        LEFT JOIN hist_markets m ON t.id = m.topic_id
                        GROUP BY t.name, t.subtopic, t.continuous, t.created_at
                    )
                    SELECT DISTINCT ON (name)
                           name,
                           bool_or(continuous) OVER (PARTITION BY name) as continuous,
                           MIN(created_at) OVER (PARTITION BY name) as created_at,
                           COUNT(*) FILTER (WHERE subtopic IS NOT NULL AND market_count > 0) OVER (PARTITION BY name) as subtopic_count,
                           SUM(market_count) OVER (PARTITION BY name) as total_markets
                    FROM topic_market_counts
                    WHERE market_count > 0 OR name IN (
                        SELECT DISTINCT name
                        FROM topic_market_counts
                        WHERE market_count > 0
                    )
                    ORDER BY name, created_at
                    """
                )
                columns = [desc[0] for desc in cur.description]
                results = [dict(zip(columns, row)) for row in cur.fetchall()]
                # Filter to only include topics that have at least one market
                return [r for r in results if r['total_markets'] > 0]

    def get_topic_info(self, name: str, subtopic: Optional[str] = None) -> Optional[dict]:
        """
        Get topic info by name and optional subtopic.

        Args:
            name: Topic name
            subtopic: Optional subtopic identifier

        Returns:
            Topic dict or None if not found
        """
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                if subtopic is not None:
                    cur.execute(
                        """
                        SELECT id, name, subtopic, continuous, created_at
                        FROM topics
                        WHERE name = %s AND subtopic = %s
                        """,
                        (name, subtopic)
                    )
                else:
                    cur.execute(
                        """
                        SELECT id, name, subtopic, continuous, created_at
                        FROM topics
                        WHERE name = %s AND subtopic IS NULL
                        """,
                        (name,)
                    )
                result = cur.fetchone()
                if result:
                    columns = [desc[0] for desc in cur.description]
                    return dict(zip(columns, result))
                return None

    # ==================== MARKETS ====================

    def register_market(
        self,
        clob_token_id: str,
        market_slug: Optional[str] = None,
        question: Optional[str] = None,
        neg: bool = False,
        topic: Optional[str] = None,
        subtopic: Optional[str] = None,
    ) -> None:
        """
        Register a market in the hist_markets table.
        If topic is provided, it must exist in the topics table.

        Args:
            clob_token_id: Market identifier
            market_slug: Optional market slug
            question: Market question
            neg: Negative risk flag
            topic: Optional topic name
            subtopic: Optional subtopic identifier
        """
        topic_id = None
        if topic:
            topic_id = self.get_topic_id_with_subtopic(topic, subtopic)
            if topic_id is None:
                subtopic_str = f" (subtopic: {subtopic})" if subtopic else ""
                raise ValueError(
                    f"Topic '{topic}'{subtopic_str} does not exist. "
                    f"Add it first with add_topic()."
                )

        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO hist_markets (clob_token_id, market_slug, question, neg, topic_id)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (clob_token_id) DO UPDATE SET
                        market_slug = COALESCE(EXCLUDED.market_slug, hist_markets.market_slug),
                        question = COALESCE(EXCLUDED.question, hist_markets.question),
                        neg = EXCLUDED.neg,
                        topic_id = COALESCE(EXCLUDED.topic_id, hist_markets.topic_id)
                    """,
                    (clob_token_id, market_slug, question, neg, topic_id),
                )

    def add_market(
        self,
        clob_token_id: str,
        market_slug: Optional[str] = None,
        question: Optional[str] = None,
        neg: bool = False,
        topic: Optional[str] = None,
        subtopic: Optional[str] = None,
    ) -> str:
        """
        Add a new market to index.
        Creates the table and registers it.
        If topic is provided, it must exist in the topics table.
        Returns the table name.

        Args:
            clob_token_id: Market identifier
            market_slug: Optional market slug
            question: Market question
            neg: Negative risk flag
            topic: Optional topic name
            subtopic: Optional subtopic identifier
        """
        table_name = self.create_market_table(clob_token_id)
        self.register_market(clob_token_id, market_slug, question, neg, topic, subtopic)
        return table_name

    def get_indexed_markets(self) -> list[dict]:
        """Get all indexed markets with their topic names and subtopics."""
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT m.clob_token_id, m.market_slug, m.question, m.neg, t.name as topic, t.subtopic
                    FROM hist_markets m
                    LEFT JOIN topics t ON m.topic_id = t.id
                    """
                )
                columns = [desc[0] for desc in cur.description]
                return [dict(zip(columns, row)) for row in cur.fetchall()]

    def get_markets_by_topic(self, topic: str, subtopic: Optional[str] = None) -> list[dict]:
        """
        Get all markets for a specific topic (and optional subtopic).

        Args:
            topic: Topic name
            subtopic: Optional subtopic identifier

        Returns:
            List of market dicts
        """
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                if subtopic is not None:
                    cur.execute(
                        """
                        SELECT m.clob_token_id, m.market_slug, m.question, m.neg, t.name as topic, t.subtopic
                        FROM hist_markets m
                        JOIN topics t ON m.topic_id = t.id
                        WHERE t.name = %s AND t.subtopic = %s
                        ORDER BY m.market_slug
                        """,
                        (topic, subtopic),
                    )
                else:
                    cur.execute(
                        """
                        SELECT m.clob_token_id, m.market_slug, m.question, m.neg, t.name as topic, t.subtopic
                        FROM hist_markets m
                        JOIN topics t ON m.topic_id = t.id
                        WHERE t.name = %s AND t.subtopic IS NULL
                        ORDER BY m.market_slug
                        """,
                        (topic,),
                    )
                columns = [desc[0] for desc in cur.description]
                return [dict(zip(columns, row)) for row in cur.fetchall()]

    def get_continuous_markets_by_topic(
        self,
        topic: str,
        subtopic: Optional[str] = None,
        amount: Optional[int] = None,
    ) -> list[dict]:
        """
        Get continuous markets for a topic (and optional subtopic), sorted by timestamp from their slugs.

        Args:
            topic: Topic name (must be a continuous topic)
            subtopic: Optional subtopic identifier
            amount: Max number of markets to return (most recent N). None = all

        Returns:
            List of market dicts sorted by timestamp (oldest first), limited to
            the most recent `amount` markets if specified.
        """
        # Get all markets for the topic (and subtopic)
        all_markets = self.get_markets_by_topic(topic, subtopic)

        # Parse and sort by timestamp from slug
        markets_with_ts = []
        for market in all_markets:
            parsed_slug = parse_continuous_slug(market.get("market_slug", ""))
            if parsed_slug:
                _, timestamp = parsed_slug
                markets_with_ts.append((timestamp, market))

        # Sort by timestamp ascending (oldest first)
        markets_with_ts.sort(key=lambda x: x[0])

        # If amount specified, take the most recent N (last N items)
        if amount is not None and len(markets_with_ts) > amount:
            markets_with_ts = markets_with_ts[-amount:]

        return [m[1] for m in markets_with_ts]

    def get_market_info(self, clob_token_id: str) -> Optional[dict]:
        """Get market info including topic details and subtopic."""
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT m.clob_token_id, m.market_slug, m.question, m.neg,
                           t.name as topic, t.subtopic, t.continuous
                    FROM hist_markets m
                    LEFT JOIN topics t ON m.topic_id = t.id
                    WHERE m.clob_token_id = %s
                    """,
                    (clob_token_id,),
                )
                result = cur.fetchone()
                if result:
                    columns = [desc[0] for desc in cur.description]
                    return dict(zip(columns, result))
                return None

    def get_continuous_markets_by_category(
        self,
        market_slug: str,
        amount: Optional[int] = None,
    ) -> list[dict]:
        """
        Get continuous markets in the same category as the given market slug.

        For a slug like 'btc-updown-15m-1770093900', finds all markets with
        the same prefix 'btc-updown-15m-*' and returns them sorted by timestamp
        (oldest first).

        Args:
            market_slug: A market slug from which to extract the category prefix
            amount: Max number of markets to return (most recent N). None = all

        Returns:
            List of market dicts sorted by timestamp (oldest first), limited to
            the most recent `amount` markets if specified.
        """
        parsed = parse_continuous_slug(market_slug)
        if not parsed:
            return []

        prefix, _ = parsed

        with self.get_connection() as conn:
            with conn.cursor() as cur:
                # Get all markets matching the prefix pattern
                cur.execute(
                    """
                    SELECT m.clob_token_id, m.market_slug, m.question, m.neg,
                           t.name as topic, t.continuous
                    FROM hist_markets m
                    LEFT JOIN topics t ON m.topic_id = t.id
                    WHERE m.market_slug LIKE %s
                    ORDER BY m.market_slug
                    """,
                    (f"{prefix}-%",),
                )
                columns = [desc[0] for desc in cur.description]
                all_markets = [dict(zip(columns, row)) for row in cur.fetchall()]

        # Parse and sort by timestamp
        markets_with_ts = []
        for market in all_markets:
            parsed_slug = parse_continuous_slug(market.get("market_slug", ""))
            if parsed_slug:
                _, timestamp = parsed_slug
                markets_with_ts.append((timestamp, market))

        # Sort by timestamp ascending (oldest first)
        markets_with_ts.sort(key=lambda x: x[0])

        # If amount specified, take the most recent N (last N items)
        if amount is not None and len(markets_with_ts) > amount:
            markets_with_ts = markets_with_ts[-amount:]

        return [m[1] for m in markets_with_ts]

    def market_exists(self, clob_token_id: str) -> bool:
        """Check if a market is already indexed."""
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT 1 FROM hist_markets WHERE clob_token_id = %s",
                    (clob_token_id,),
                )
                return cur.fetchone() is not None

    def get_trade_count(self, clob_token_id: str) -> int:
        """Get the number of trades for a market."""
        table_name = self.get_table_name_for_market(clob_token_id)
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(f"SELECT COUNT(*) FROM {table_name}")
                result = cur.fetchone()
                return result[0] if result else 0

    # ==================== TRADES ====================

    def insert_trades(self, clob_token_id: str, trades: list[dict]) -> int:
        """
        Insert trades into the market's hist_trades table.
        Returns the number of inserted rows.
        """
        if not trades:
            return 0

        table_name = self.get_table_name_for_market(clob_token_id)

        columns = [
            "tx_hash",
            "block_number",
            "block_time",
            "maker",
            "taker",
            "maker_asset_id",
            "taker_asset_id",
            "maker_amount_filled",
            "taker_amount_filled",
            "fee",
            "side",
            "price",
        ]

        values = [
            (
                t.get("tx_hash"),
                t.get("block_number"),
                t.get("block_time"),
                t.get("maker"),
                t.get("taker"),
                str(t.get("maker_asset_id") or ""),
                str(t.get("taker_asset_id") or ""),
                t.get("maker_amount_filled"),
                t.get("taker_amount_filled"),
                t.get("fee"),
                t.get("side"),
                t.get("price"),
            )
            for t in trades
        ]

        with self.get_connection() as conn:
            with conn.cursor() as cur:
                insert_sql = f"""
                    INSERT INTO {table_name} ({', '.join(columns)})
                    VALUES %s
                    ON CONFLICT (tx_hash, maker, taker, maker_amount_filled) DO NOTHING
                """
                execute_values(cur, insert_sql, values)
                return cur.rowcount

    def get_trades(
        self,
        clob_token_id: str,
        limit: Optional[int] = None,
        offset: int = 0,
        order_by: str = "block_time",
        ascending: bool = True,
    ) -> list[dict]:
        """
        Get all trades from a market's hist_trades table.

        Args:
            clob_token_id: The market identifier
            limit: Max number of trades to return (None for all)
            offset: Number of trades to skip
            order_by: Column to order by (default: block_time)
            ascending: Sort order (default: True for oldest first)

        Returns:
            List of trade dictionaries
        """
        table_name = self.get_table_name_for_market(clob_token_id)
        order_dir = "ASC" if ascending else "DESC"

        with self.get_connection() as conn:
            with conn.cursor() as cur:
                query = f"""
                    SELECT id, tx_hash, block_number, block_time, maker, taker,
                           maker_asset_id, taker_asset_id, maker_amount_filled,
                           taker_amount_filled, fee, side, price, created_at
                    FROM {table_name}
                    ORDER BY {order_by} {order_dir}
                """
                if limit is not None:
                    query += f" LIMIT {limit} OFFSET {offset}"

                cur.execute(query)
                columns = [desc[0] for desc in cur.description]
                return [dict(zip(columns, row)) for row in cur.fetchall()]
