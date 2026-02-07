"""
Grid trading strategy.
Places buy/sell orders at fixed price intervals around a base price.
"""

from decimal import Decimal
from typing import Optional
import pandas as pd

from app.core.strategy import Strategy, Order


class GridStrategy(Strategy):
    """
    Grid trading strategy.

    Creates a grid of buy orders below current price and sell orders above.
    Profits from price oscillations within a range.
    """

    def __init__(
        self,
        grid_size: int = 5,
        grid_spacing: Decimal = Decimal("0.01"),
        order_size: Decimal = Decimal("100"),
        initial_balance: Decimal = Decimal("10000"),
        protection_threshold: Optional[int] = None,
    ):
        """
        Initialize grid strategy.

        Args:
            grid_size: Number of grid levels above and below
            grid_spacing: Price difference between grid levels (as decimal, 0.01 = 1%)
            order_size: Size of each order
            initial_balance: Starting balance
            protection_threshold: Extra levels beyond grid to trigger emergency sell-all
                                  (e.g., 1 means sell all if price drops 1 level below grid bottom)
        """
        super().__init__(initial_balance)
        self.grid_size = grid_size
        self.grid_spacing = grid_spacing
        self.order_size = order_size
        self.protection_threshold = protection_threshold

        self.base_price: Optional[Decimal] = None
        self.grid_levels: dict[str, Decimal] = {}
        self.last_level: Optional[int] = None
        self.protection_triggered: bool = False

    def on_start(self) -> None:
        """Reset grid state."""
        self.base_price = None
        self.grid_levels = {}
        self.last_level = None
        self.protection_triggered = False

    def on_trade(self, trade_data: pd.Series, historical_data: pd.DataFrame) -> list[Order]:
        """
        Process incoming trade and generate orders.

        Grid logic:
        - First trade sets the base price
        - When price crosses a grid level, execute trade in opposite direction
        - When price escapes grid bounds, recenter the grid
        - Protection threshold: if price drops too far, sell all and stop trading
        """
        current_price = Decimal(str(trade_data["price"]))
        orders = []

        # If protection was triggered, don't trade anymore
        if self.protection_triggered:
            return orders

        # Initialize base price on first trade
        if self.base_price is None:
            self.base_price = current_price
            self._setup_grid()
            self.last_level = 0
            return orders

        # Determine current grid level (unclamped)
        raw_level = self._get_raw_level(current_price)

        # Check protection threshold - sell all if price drops too far below grid
        if self.protection_threshold is not None:
            protection_level = -(self.grid_size + self.protection_threshold)
            if raw_level <= protection_level:
                # Protection triggered! Sell all positions
                self.protection_triggered = True
                if self.state.position is not None and self.state.position.size > 0:
                    # Close entire position
                    orders.append(
                        Order(
                            side="sell",
                            price=current_price,
                            size=self.state.position.size,
                            order_type="market",
                        )
                    )
                return orders

        # If price escaped grid bounds (upward), recenter
        if raw_level > self.grid_size:
            self.base_price = current_price
            self._setup_grid()
            self.last_level = 0
            return orders

        # If price escaped grid bounds (downward) but not at protection level, recenter
        if raw_level < -self.grid_size:
            self.base_price = current_price
            self._setup_grid()
            self.last_level = 0
            return orders

        current_level = raw_level

        # Check if we crossed a grid level
        if self.last_level is not None and current_level != self.last_level:
            # Price moved up -> sell
            if current_level > self.last_level:
                if self.state.position is None or self.state.position.side == "long":
                    orders.append(
                        Order(
                            side="sell",
                            price=current_price,
                            size=self.order_size,
                            order_type="market",
                        )
                    )
            # Price moved down -> buy
            elif current_level < self.last_level:
                if self.state.position is None or self.state.position.side == "short":
                    orders.append(
                        Order(
                            side="buy",
                            price=current_price,
                            size=self.order_size,
                            order_type="market",
                        )
                    )

        self.last_level = current_level
        return orders

    def _setup_grid(self) -> None:
        """Setup grid levels around base price."""
        if self.base_price is None:
            return

        for i in range(-self.grid_size, self.grid_size + 1):
            level_price = self.base_price * (1 + self.grid_spacing * i)
            self.grid_levels[f"level_{i}"] = level_price

    def _get_raw_level(self, price: Decimal) -> int:
        """Get unclamped grid level."""
        if self.base_price is None:
            return 0
        ratio = price / self.base_price - 1
        return int(ratio / self.grid_spacing)

    def _get_grid_level(self, price: Decimal) -> int:
        """Determine which grid level the price is at (clamped)."""
        return max(-self.grid_size, min(self.grid_size, self._get_raw_level(price)))
