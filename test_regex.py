import re

content = """
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES auth.users(id)
);
"""

pattern = r"announcements.*created_by"
if re.search(pattern, content, re.IGNORECASE | re.DOTALL):
    print("MATCH")
else:
    print("NO MATCH")
