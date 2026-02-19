-- Project: OdevGPT
-- 20260219_PERSISTENT_SOCTRATIC_MEMORY.sql
-- Description: Implements persistent chat history and session context as per Qwen's DS.md recommendations.

-- 1. Create AI Chat Sessions table to group messages
CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    subject TEXT,
    topic TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Create AI Chat Messages table for persistent history
CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Students can view their own sessions" ON public.ai_chat_sessions;
CREATE POLICY "Students can view their own sessions" ON public.ai_chat_sessions
    FOR ALL USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can view their own messages" ON public.ai_chat_messages;
CREATE POLICY "Students can view their own messages" ON public.ai_chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.ai_chat_sessions 
            WHERE id = session_id AND student_id = auth.uid()
        )
    );

-- 5. Helper Function to get session history
CREATE OR REPLACE FUNCTION public.get_session_history(p_session_id UUID)
RETURNS TABLE (
    role TEXT,
    content TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT m.role, m.content
    FROM public.ai_chat_messages m
    WHERE m.session_id = p_session_id
    ORDER BY m.created_at ASC;
END;
$$;
