-- Auxiliary function
DROP FUNCTION IF EXISTS decrease_lots(UUID, INTEGER);

DROP TYPE IF EXISTS lot_decrement;

CREATE TYPE lot_decrement AS (
  lot_id UUID,
  qty INTEGER,
  cost_price NUMERIC(19,6)
);

CREATE FUNCTION decrease_lots(stock_input_id UUID, dec_total_qty INTEGER)
RETURNS lot_decrement[]
AS $$
DECLARE
  decrements lot_decrement[] := '{}';
  lot RECORD;
  taken_units INTEGER := 0;
  qty_to_decrease INTEGER;
BEGIN
  FOR lot IN
    SELECT sl.id, sl.total_qty, sl.cost_price
    FROM "stock_lots" AS sl
    JOIN "stocks" AS s ON sl.stock_id = s.id
    WHERE sl.stock_id = stock_input_id
      AND sl.total_qty > 0 
      AND (sl.expires_at IS NULL OR sl.expires_at > CURRENT_DATE)
    ORDER BY
      sl.expires_at ASC NULLS LAST,
      CASE WHEN s.strategy = 'fifo' THEN sl.created_at END ASC,
      CASE WHEN s.strategy = 'lifo' THEN sl.created_at END DESC
    FOR UPDATE
  LOOP
    -- Checks if operation is completed.
    IF taken_units = dec_total_qty THEN
      EXIT;
    END IF;

    -- pending quantity.
    qty_to_decrease := dec_total_qty - taken_units;

    -- Checks if quantity of lot is less than pending quantity.
    IF qty_to_decrease > lot.total_qty THEN
      qty_to_decrease := lot.total_qty;
    END IF;

    UPDATE "stock_lots" 
    SET total_qty = total_qty - qty_to_decrease 
    WHERE id = lot.id;

    taken_units := taken_units + qty_to_decrease;

    decrements := array_append(
      decrements, 
      ROW(lot.id, qty_to_decrease, lot.cost_price)::lot_decrement
    );
  END LOOP;

  -- Raise exception if not enough units.
  IF taken_units != dec_total_qty THEN
    RAISE EXCEPTION 'Not enough units on Stock %.', stock_input_id;
  END IF;

  RETURN decrements;
END;
$$ LANGUAGE plpgsql;
