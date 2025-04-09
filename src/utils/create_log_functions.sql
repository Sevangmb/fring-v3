
-- Function to get unique log categories
CREATE OR REPLACE FUNCTION public.get_unique_log_categories()
RETURNS TABLE (category TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT logs.category
  FROM public.logs
  WHERE logs.category IS NOT NULL
  ORDER BY logs.category;
END;
$$;

-- Function to delete old logs
CREATE OR REPLACE FUNCTION public.delete_old_logs(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.logs
  WHERE created_at < NOW() - (days_to_keep * INTERVAL '1 day');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

-- Function to count logs by level
CREATE OR REPLACE FUNCTION public.count_logs_by_level()
RETURNS TABLE (
  log_level TEXT,
  log_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    logs.level as log_level,
    COUNT(*) as log_count
  FROM public.logs
  GROUP BY logs.level
  ORDER BY log_count DESC;
END;
$$;
