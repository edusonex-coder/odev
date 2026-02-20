/**
 * Edusonex Central Knowledge Graph (RAG) Utility
 * Manages cross-product intelligence and semantic memory.
 */
import { supabase } from "./supabase";

export interface KnowledgeEntry {
    category: 'educational' | 'business' | 'legal' | 'technical';
    source_product: string;
    content: string;
    metadata?: any;
}

/**
 * Stores a new piece of knowledge into the central graph.
 * This can be used by any AI agent to contribute to the global memory.
 */
export async function contributeToKnowledge(entry: KnowledgeEntry) {
    console.log(`Knowledge Contribution: [${entry.source_product}] -> [${entry.category}]`);

    const { data, error } = await supabase.from('ai_knowledge_graph').upsert({
        category: entry.category,
        source_product: entry.source_product,
        content_text: entry.content,
        metadata: entry.metadata || {}
    }, { onConflict: 'content_text' });

    if (error) {
        if (error.code === '42P01') {
            console.warn("[Knowledge] Table 'ai_knowledge_graph' missing. Contribution skipped.");
        } else {
            console.error("Knowledge Graph Error:", error.message);
        }
        return false;
    }
    return true;
}

/**
 * Searches the knowledge graph for relevant context based on category.
 * In a full RAG system, this would use vector embeddings. 
 * For now, it uses semantic text search/filtering.
 */
export async function queryKnowledge(query: string, category?: string) {
    let q = supabase.from('ai_knowledge_graph').select('*');

    if (category) {
        q = q.eq('category', category);
    }

    // Sanitize query: remove short words and stop words for better ilike matching
    const keywords = query.split(' ')
        .filter(word => word.length > 3)
        .slice(0, 3);

    if (keywords.length > 0) {
        // Match ANY of the keywords
        const filter = keywords.map(k => `content_text.ilike.%${k}%`).join(',');
        q = q.or(filter);
    } else {
        q = q.ilike('content_text', `%${query}%`);
    }

    const { data, error } = await q.limit(5);

    if (error) {
        if (error.code === '42P01') {
            console.warn("[Knowledge] Table 'ai_knowledge_graph' missing. Query skipped.");
        } else {
            console.error("Knowledge Query Error:", error.message);
        }
        return [];
    }

    return data;
}

/**
 * AI Control Plane: Unified Knowledge Injector
 * Injects relevant cross-product context into any AI prompt.
 */
export async function injectContext(prompt: string, category: string): Promise<string> {
    try {
        const context = await queryKnowledge(prompt.split(' ').slice(0, 5).join(' '), category);

        if (context && context.length > 0) {
            const contextText = context.map(c => `[Context from ${c.source_product}]: ${c.content_text}`).join('\n');
            return `Aşağıdaki ek bilgiler (Knowledge Graph) doğrultusunda cevap ver:\n\n${contextText}\n\nİstek: ${prompt}`;
        }
    } catch (e) {
        console.warn("Context injection failed (ignored):", e);
    }

    return prompt;
}
